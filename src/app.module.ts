import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DomainModule } from './apps';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { BlogModule } from './modules/blog/blog.module';
import { CategoryModule } from './modules/category/category.module';
import { HouseRentModule } from './modules/house-rent/house-rent.module';
import { HostelRentModule } from './modules/hostel-rent/hostel-rent.module';
import { RolesGuard } from './common/guards/roles.guard';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { defineConfig, PostgreSqlDriver } from '@mikro-orm/postgresql';
import { Migrator } from '@mikro-orm/migrations';
import { EntityGenerator } from '@mikro-orm/entity-generator';
import { SeedManager } from '@mikro-orm/seeder';
import { User, Admin, Host, Customer, Doctor, Category, HouseRent, HostelRent, Blog } from './entities';
import { CloudinaryModule } from './common/cloudinary/cloudinary.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MikroOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        defineConfig({
          driver: PostgreSqlDriver,
          clientUrl: configService.get('DATABASE_URL'),
          entities: [User, Admin, Host, Customer, Doctor, Category, HouseRent, HostelRent, Blog],
          debug: configService.get('NODE_ENV') !== 'production',
          driverOptions: {
            connection: {
              ssl: { rejectUnauthorized: false }
            }
          },
          extensions: [Migrator, EntityGenerator, SeedManager],
          migrations: {
            path: './dist/migrations',
            pathTs: './src/migrations',
          },
        }),
    }),
    CloudinaryModule,
    DomainModule,
    AuthModule,
    UserModule,
    BlogModule,
    CategoryModule,
    HouseRentModule,
    HostelRentModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
