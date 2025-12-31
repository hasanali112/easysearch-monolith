import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { HostelRentController } from './hostel-rent.controller';
import { HostelRentService } from './hostel-rent.service';
import { HostelRent, Host, Category, User } from '../../entities';

@Module({
  imports: [MikroOrmModule.forFeature([HostelRent, Host, Category, User])],
  controllers: [HostelRentController],
  providers: [HostelRentService],
  exports: [HostelRentService],
})
export class HostelRentModule {}
