import { Injectable, ConflictException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EntityManager } from '@mikro-orm/core';
import * as bcrypt from 'bcrypt';
import { User, Admin, Host, Customer, Doctor } from '../../entities';
import { UserRole, UserStatus } from '../../enums';
import { RegisterDto, LoginDto, ChangePasswordDto } from './dto/auth.dto';
import { JwtPayload } from './strategies/jwt.strategy';

@Injectable()
export class AuthService {
  constructor(
    private readonly em: EntityManager,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    try {
      const fork = this.em.fork();

      // Check if user already exists
      const existingUser = await fork.findOne(User, {
        $or: [
          { email: registerDto.email },
          { contactNumber: registerDto.contactNumber },
        ],
      });

      if (existingUser) {
        throw new ConflictException('User with this email or contact number already exists');
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(registerDto.password, 12);

      // Create user
      const user = new User();
      user.email = registerDto.email;
      user.contactNumber = registerDto.contactNumber;
      user.password = hashedPassword;
      user.role = registerDto.role;
      user.status = UserStatus.ACTIVE;

      // Create role-specific profile
      await this.createRoleProfile(fork, user, registerDto);

      await fork.persistAndFlush(user);

      // Generate tokens
      const tokens = this.generateTokens(user);

      // Return user data without password
      const { password, ...userWithoutPassword } = user;

      return {
        success: true,
        message: 'User registered successfully',
        data: {
          user: userWithoutPassword,
          ...tokens,
        },
      };
    } catch (error) {
      // Handle database errors
      if (error instanceof ConflictException) {
        throw error;
      }
      if (error.message.includes('relation')) {
        throw new BadRequestException('Database tables are not initialized');
      }
      throw error;
    }
  }

  async login(loginDto: LoginDto): Promise<{ success: boolean; message: string; data: { user: Partial<User>; accessToken: string; refreshToken: string } }> {
    try {
      const fork = this.em.fork();

      // Find user with all profile relations
      const user = await fork.findOne(
        User,
        { email: loginDto.email },
        { populate: ['admin', 'host', 'customer', 'doctor'] },
      );

      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      // Check user status
      if (user.status === UserStatus.BLOCKED) {
        throw new UnauthorizedException('Your account has been blocked');
      }

      if (user.status === UserStatus.INACTIVE) {
        throw new UnauthorizedException('Your account is inactive');
      }

      if (user.status === UserStatus.PENDING) {
        throw new UnauthorizedException('Your account is pending approval');
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);

      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      // Generate tokens
      const tokens = this.generateTokens(user);

      // Return user data without password
      const { password, ...userWithoutPassword } = user;

      return {
        success: true,
        message: 'Login successful',
        data: {
          user: userWithoutPassword,
          ...tokens,
        },
      };
    } catch (error) {
      // Handle database errors
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      if (error.message.includes('relation')) {
        throw new BadRequestException('Database tables are not initialized');
      }
      throw error;
    }
  }

  async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
    try {
      const fork = this.em.fork();

      const user = await fork.findOne(User, { id: userId });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // Verify old password
      const isOldPasswordValid = await bcrypt.compare(
        changePasswordDto.oldPassword,
        user.password,
      );

      if (!isOldPasswordValid) {
        throw new BadRequestException('Old password is incorrect');
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(changePasswordDto.newPassword, 12);

      user.password = hashedPassword;
      user.needPasswordChange = false;

      await fork.persistAndFlush(user);

      return {
        success: true,
        message: 'Password changed successfully',
        data: null,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException || error instanceof BadRequestException) {
        throw error;
      }
      if (error.message.includes('relation')) {
        throw new BadRequestException('Database tables are not initialized');
      }
      throw error;
    }
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key',
      });

      const fork = this.em.fork();
      const user = await fork.findOne(User, { id: payload.userId });

      if (!user) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const accessToken = this.generateAccessToken(user);

      return {
        success: true,
        message: 'Access token refreshed successfully',
        data: { accessToken },
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      if (error.message.includes('relation')) {
        throw new BadRequestException('Database tables are not initialized');
      }
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  private async createRoleProfile(fork: EntityManager, user: User, registerDto: RegisterDto) {
    switch (registerDto.role) {
      case UserRole.ADMIN:
      case UserRole.SUPER_ADMIN:
        const admin = new Admin();
        admin.name = registerDto.name;
        admin.user = user;
        user.admin = admin;
        fork.persist(admin);
        break;

      case UserRole.HOST:
        const host = new Host();
        host.name = registerDto.name;
        host.user = user;
        user.host = host;
        fork.persist(host);
        break;

      case UserRole.CUSTOMER:
        const customer = new Customer();
        customer.name = registerDto.name;
        customer.user = user;
        user.customer = customer;
        fork.persist(customer);
        break;

      case UserRole.DOCTOR:
        if (!registerDto.registrationNumber || !registerDto.qualification) {
          throw new BadRequestException(
            'Registration number and qualification are required for doctors',
          );
        }
        const doctor = new Doctor();
        doctor.name = registerDto.name;
        doctor.registrationNumber = registerDto.registrationNumber;
        doctor.qualification = registerDto.qualification;
        doctor.appointmentFee = registerDto.appointmentFee || 0;
        doctor.user = user;
        user.doctor = doctor;
        fork.persist(doctor);
        break;
    }
  }

  private generateTokens(user: User) {
    const payload: JwtPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
      secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '30d',
      secret: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key',
    });

    return { accessToken, refreshToken };
  }

  private generateAccessToken(user: User): string {
    const payload: JwtPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    return this.jwtService.sign(payload, {
      expiresIn: '7d',
      secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
    });
  }
}
