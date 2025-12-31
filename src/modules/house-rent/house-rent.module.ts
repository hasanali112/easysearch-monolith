import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { HouseRentController } from './house-rent.controller';
import { HouseRentService } from './house-rent.service';
import { HouseRent, Host, Category, User } from '../../entities';

@Module({
  imports: [MikroOrmModule.forFeature([HouseRent, Host, Category, User])],
  controllers: [HouseRentController],
  providers: [HouseRentService],
  exports: [HouseRentService],
})
export class HouseRentModule {}
