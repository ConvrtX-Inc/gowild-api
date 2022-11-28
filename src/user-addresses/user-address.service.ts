import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import {UserAddress} from './user-address.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import {UserEntity} from "../users/user.entity";

@Injectable()
export class UserAddressService extends TypeOrmCrudService<UserAddress> {
  constructor(
    @InjectRepository(UserAddress)
    private userAddressRepository: Repository<UserAddress>,
  ) {
    super(userAddressRepository);
  }

  async save(userAddress: UserAddress): Promise<void> {

    await this.userAddressRepository.save(userAddress);
  }

}
