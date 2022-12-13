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
import { FindConditions, ObjectID, Repository } from 'typeorm';
import { CreateSubAdminDto } from './dto/create-sub-admin.dto';
import { UpdateSubAdminDto } from './dto/update-sub-admin.dto';

@Injectable()
export class SubAdminService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    private readonly usersService: UsersService,
    private readonly passwordService: PasswordService,
    private readonly statusService: StatusService,
    private readonly roleService: RoleService,
  ) { }
  public async registerSubAdmin(dto: CreateSubAdminDto){

    let entity = new UserEntity();
    entity.firstName = dto.firstName,
    entity.lastName = dto.lastName,
    entity.gender = dto.gender;
    entity.email = dto.email;
    entity.username = entity.fullName;
    entity.phoneNo = dto.phoneNo;
    entity.addressOne = dto.addressOne;
    entity.addressTwo = dto.addressTwo;
    entity.phoneVerified = false;
  
   
    entity.status = await this.statusService.findByEnum(StatusEnum.Active);
    entity.role = await this.roleService.findByEnum(RoleEnum.ADMIN);
    entity = await this.usersService.saveEntity(entity);

    const temporaryPassword = entity.getTemporaryPassword;
    await this.passwordService.createPassword(entity, temporaryPassword);

    return {
      temporaryPassword:temporaryPassword, userData:entity
    };
  }

  public async updateSubAdmin(id: string, dto: UpdateUserDto): Promise<UserEntity>{
    const admin = await this.usersRepository.findOne({
      where: { id: id },
    });
    console.log(id);
    if (!admin) {
      throw new NotFoundException({
        errors: [
          {
            user: 'Admin do not exist',
          },
        ],
      });
    }

    admin.firstName = dto.firstName,
    admin.lastName = dto.lastName,
    admin.addressOne = dto.addressOne;
    admin.addressTwo = dto.addressTwo;
    admin.username = dto.username;
    admin.email = dto.email;
  
    
    await admin.save();
    return admin;

  }

  async findOneSubAdmin(id: string) {
    const admin = await this.usersRepository.findOne({
      where: {id: id}
    });
    let tenMinutesBefore = new Date();
    tenMinutesBefore.setMinutes(tenMinutesBefore.getMinutes() - 10);
    let container : {
      name: string;
      username : string;
      email: string;
      onlineStatus: boolean;
      location: string;
      accountStatus: string;
    }={
      name: `${admin.firstName} ${admin.lastName}`,
      username:admin.username,
      email: admin.email,
      onlineStatus: admin.updatedDate>tenMinutesBefore ? true : false,
      location: `${admin.addressOne}, ${admin.addressTwo}`,
      accountStatus: admin.status.statusName
    };
    
    return container;


  }

  async findAllSubAdmin(){
    const admins = await this.usersRepository.find({
      relations: ['role'],
      where: {
        role: {
          name: RoleEnum.ADMIN,
        },

      }
    });
    let tenMinutesBefore = new Date();
    tenMinutesBefore.setMinutes(tenMinutesBefore.getMinutes() - 10);
  
    const data = admins.map((obj)=>{
      let container : {
        username : string;
        name: string;
        email: string;
        onlineStatus: boolean;
        location: string;
        accountStatus: string;
      }={
        name: `${obj.firstName} ${obj.lastName}`,
        username:obj.username,
        email: obj.email,
        onlineStatus: obj.updatedDate>tenMinutesBefore ? true : false,
        location: `${obj.addressOne}, ${obj.addressTwo}`,
        accountStatus: obj.status.statusName
      };
      return container;
    });
    return data;
  }

  async deleteSubAdmin(id: string){
    await this.usersRepository.softDelete(id);
    return {
    message: "User deleted"
    }
  }
}