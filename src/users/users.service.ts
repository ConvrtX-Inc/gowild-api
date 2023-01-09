import { Injectable, NotFoundException } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { UserEntity } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FindOptions } from 'src/common/types/find-options.type';
import { DeepPartial } from 'src/common/types/deep-partial.type';
import { StatusEnum } from 'src/auth/status.enum';
import { MailService } from 'src/mail/mail.service';
import { StatusService } from '../statuses/status.service';
import { FilesService } from '../files/files.service';
import { FileEntity } from "../files/file.entity";
import { UpdateUserDto } from "./dtos/update-user.dto";
import { RoleEnum } from 'src/roles/roles.enum';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class UsersService extends TypeOrmCrudService<UserEntity> {
  constructor(
    private readonly mailService: MailService,
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    private readonly statusService: StatusService,

  ) {
    super(usersRepository);
  }

  async findOneEntity(
    options: FindOptions<UserEntity>,
  ): Promise<UserEntity | null> {
    const user = await this.usersRepository.findOne({
      where: options.where,
    });
    if (user) {
      return user;
    }
    return null;
  }

  async findManyEntities(options: FindOptions<UserEntity>) {
    return this.usersRepository.find({
      where: options.where,
    });
  }

  async saveEntity(data: DeepPartial<UserEntity>) {
    return this.usersRepository.save(this.usersRepository.create(data));
  }

  async softDelete(id: string): Promise<void> {
    await this.usersRepository.softDelete(id);
  }

  async updateUserStatus(
    id: string,
    statusEnum: StatusEnum,
  ): Promise<UserEntity> {
    const user = await this.usersRepository.findOne({
      where: { id: id },
    });
    if (!user) {
      throw new NotFoundException({
        errors: [
          {
            user: 'user does not exist',
          },
        ],
      });
    }
    const status = await this.statusService.findByEnum(statusEnum);
    user.status = status;
    await user.save();

    await this.mailService.userUpdateStatus(
      {
        to: user.email,
        name: user.fullName,
        data: {},
      },
      status,
    );

    return user;
  }

  public async updatePictures(id: string, picture: string, frontImage: string, backImage: string) {
    const user = await this.usersRepository.findOne({
      where: { id: id },
    });

    if (!user) {
      throw new NotFoundException({
        errors: [
          {
            user: 'user does not exist',
          },
        ],
      });
    }

    if (picture) {
      user.picture = picture;
    }
    if (frontImage) {
      user.frontImage = frontImage;
    }
    if (backImage) {
      user.backImage = picture;
    }

    return { message: "User Updated Successfully!", user : await user.save() };

  }

  public async updateProfile(id: string, dto: UpdateUserDto) {    
    await this.usersRepository.createQueryBuilder()
      .update()
      .set(dto)
      .where('id = :id', { id })
      .execute()

   const user = await this.usersRepository.findOne({
      where: { id: id },
    });

    return {
      message : "User Updated Successfully",
      user : user
    }
  }


  // get one user for admin panel
  async findOneUser(id: string) {
    const user = await this.usersRepository.findOne({
      where: {id: id}
    });
    let tenMinutesBefore = new Date();
    tenMinutesBefore.setMinutes(tenMinutesBefore.getMinutes() - 10);
    let container : {
      id: string;
      firstName : string;
      lastName: string;
      email: string;
      onlineStatus: boolean;
      location: string;
      accountStatus: string;
    }={
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      onlineStatus: user.updatedDate>tenMinutesBefore ? true : false,
      location: `${user.addressOne}, ${user.addressTwo}`,
      accountStatus: user.status.statusName
    };

    return container;


  }

  // get all users
  async findAllUsers(){
    const users = await this.usersRepository.find({
      relations: ['role'],
      where: {
        role: {
          name: RoleEnum.USER,
        },

      }
    });
    let tenMinutesBefore = new Date();
    tenMinutesBefore.setMinutes(tenMinutesBefore.getMinutes() - 10);

    const data = users.map((obj)=>{
      let container : {
        id: string
        firstName : string;
        lastName : string;
        gender: string;
        phoneNo: string;
        picture: string;
        email: string;
        dateOfBirth: Date;
        onlineStatus: boolean;
        location: string;
        accountStatus: string;
      }={
        id: obj.id,
        firstName: obj.firstName,
        lastName: obj.lastName,
        gender: obj.gender,
        phoneNo: obj.phoneNo,
        picture: obj.picture,
        email: obj.email,
        dateOfBirth: obj.birthDate,
        onlineStatus: obj.updatedDate>tenMinutesBefore ? true : false,
        location: `${obj.addressOne}, ${obj.addressTwo}`,
        accountStatus: obj.status.statusName
      };
      return container;
    });
    return data;
  }

  async getUserCount(){
    const allUsers = await this.usersRepository.find({});
    return{
      'signup_users': await this.usersRepository.count({}),
      'active_users': await this.usersRepository.count({
        relations:['status'],
        where:{
          status:{
            statusName:StatusEnum.Active
          }
        }
      }),
      'inactive_users': await this.usersRepository.count({
        relations:['status'],
        where:{
          status:{
            statusName:StatusEnum.Inactive
          }
        }
      })
    }
  }
}


