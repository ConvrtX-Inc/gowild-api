import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {UserAddressService} from "./user-address.service";
import {UserAddress} from "./user-address.entity";

@Module({
  providers: [UserAddressService],
  exports: [UserAddressService],
  imports: [TypeOrmModule.forFeature([UserAddress])],
})
export class UserAddressModule {}
