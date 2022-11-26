import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Role } from './role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import {RoleEnum} from "./roles.enum";

@Injectable()
export class RoleService extends TypeOrmCrudService<Role> {
  constructor(
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
  ) {
    super(rolesRepository);
  }

  public async findByEnum(role: RoleEnum) {
    return this.rolesRepository.findOne({ where: { name: role } });
  }
}
