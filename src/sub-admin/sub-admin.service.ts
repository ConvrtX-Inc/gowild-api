import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StatusEnum } from 'src/auth/status.enum';
import { NotFoundException } from 'src/exceptions/not-found.exception';
import { RoleService } from 'src/roles/role.service';
import { RoleEnum } from 'src/roles/roles.enum';
import { StatusService } from 'src/statuses/status.service';
import { UpdateUserDto } from 'src/users/dtos/update-user.dto';
import { PasswordService } from 'src/users/password.service';
import { UserEntity } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CreateSubAdminDto } from './dto/create-sub-admin.dto';
import { UpdateSubAdminDto } from './dto/update-sub-admin.dto';

@Injectable()
export class SubAdminService {
  constructor(
    private readonly usersService: UsersService,
    private readonly passwordService: PasswordService,
    private readonly statusService: StatusService,
    private readonly roleService: RoleService,
  ) { }
  public async registerSubAdmin(dto: CreateSubAdminDto): Promise<UserEntity>{

    let entity = new UserEntity();
    entity.firstName = dto.firstName,
    entity.lastName = dto.lastName,
    entity.gender = dto.gender;
    entity.email = dto.email;
    entity.username = dto.email;
    entity.phoneNo = dto.phoneNo;
    entity.addressOne = dto.addressOne;
    entity.addressTwo = dto.addressTwo;
    entity.phoneVerified = false;
    entity.temporaryPassword = entity.getTemporaryPassword;
    
    entity.status = await this.statusService.findByEnum(StatusEnum.Active);
    entity.role = await this.roleService.findByEnum(RoleEnum.ADMIN);
    entity = await this.usersService.saveEntity(entity);
    await this.passwordService.createPassword(entity, entity.temporaryPassword);

    return entity;
  }

  // public async updateSubAdmin(id: string, dto: UpdateUserDto): Promise<UserEntity>{
  //   let admin = await this.userRepository.findOne({
  //     where: { id: id },
  //   });
  //   if (!admin) {
  //     throw new NotFoundException({
  //       errors: [
  //         {
  //           user: 'Admin do not exist',
  //         },
  //       ],
  //     });
  //   }
  //   admin.firstName = dto.firstName,
  //   admin.lastName = dto.lastName,
  //   admin.addressOne = dto.addressOne;
  //   admin.addressTwo = dto.addressTwo;
    
  //   return await admin.save();

  // }

}
