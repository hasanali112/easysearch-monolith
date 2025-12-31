import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User, Admin, Host, Customer, Doctor } from '../../entities';

@Module({
  imports: [MikroOrmModule.forFeature([User, Admin, Host, Customer, Doctor])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
