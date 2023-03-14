import { Injectable, NotFoundException } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { UserEntity } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { FindOptions } from 'src/common/types/find-options.type';
import { DeepPartial } from 'src/common/types/deep-partial.type';
import { StatusEnum } from 'src/auth/status.enum';
import { MailService } from 'src/mail/mail.service';
import { StatusService } from '../statuses/status.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { RoleEnum } from 'src/roles/roles.enum';
import { UserLoginLogs } from 'src/dashboard/entities/user_login_logs.entity';

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

    /*await this.mailService.userUpdateStatus(
      {
        to: user.email,
        name: user.fullName,
        data: {},
      },
      status,
    );*/

    return user;
  }

  public async updatePictures(
    id: string,
    picture: string,
    frontImage: string,
    backImage: string,
  ) {
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
      user.backImage = backImage;
    }

    return { message: 'User Updated Successfully!', user: await user.save() };
  }

  public async updateProfile(id: string, dto: UpdateUserDto) {
    await this.usersRepository
      .createQueryBuilder()
      .update()
      .set(dto)
      .where('id = :id', { id })
      .execute();

    const user = await this.usersRepository.findOne({
      where: { id: id },
    });

    return {
      message: 'User Updated Successfully',
      user: user,
    };
  }

  // get one user for admin panel
  async findOneUser(id: string) {
    const user = await this.usersRepository.findOne({
      where: { id: id },
    });
    const tenMinutesBefore = new Date();
    tenMinutesBefore.setMinutes(tenMinutesBefore.getMinutes() - 10);
    const container: {
      id: string;
      firstName: string;
      lastName: string;
      username: string;
      email: string;
      onlineStatus: boolean;
      location: string;
      locationTwo: string;
      accountStatus: string;
      frontImage: string;
      backImage: string
    } = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      onlineStatus: user.updatedDate > tenMinutesBefore ? true : false,
      location: `${user.addressOne}`,
      locationTwo: `${user.addressTwo}`,
      accountStatus: user.status.statusName,
      frontImage: user.frontImage,
      backImage: user.backImage
    };

    return container;
  }

  // get all users
  async findAllUsers() {
    const users = await this.usersRepository.find({
      relations: ['role'],
      where: {
        role: {
          name: RoleEnum.USER,
        },
      },
      order: {createdDate: 'DESC'}
    });
    const tenMinutesBefore = new Date();
    tenMinutesBefore.setMinutes(tenMinutesBefore.getMinutes() - 10);

    const data = users.map((obj) => {
      const container: {
        id: string;
        firstName: string;
        lastName: string;
        username: string;
        gender: string;
        phoneNo: string;
        picture: string;
        email: string;
        dateOfBirth: Date;
        onlineStatus: boolean;
        location: string;
        locationTwo: string;
        accountStatus: string;
        frontImage: string;
        backImage: string
      } = {
        id: obj.id,
        firstName: obj.firstName,
        lastName: obj.lastName,
        username: obj.username,
        gender: obj.gender,
        phoneNo: obj.phoneNo,
        picture: obj.picture,
        email: obj.email,
        dateOfBirth: obj.birthDate,
        onlineStatus: obj.updatedDate > tenMinutesBefore ? true : false,
        location: `${obj.addressOne}`,
        locationTwo: `${obj.addressTwo}`,
        accountStatus: obj.status.statusName,
        frontImage: obj.frontImage,
        backImage: obj.backImage
      };
      return container;
    });
    return data;
  }




  async getGraphUsers() {
    const todayDate = new Date(Date.now());
    const startOfMonth = new Date(todayDate.getFullYear(), todayDate.getMonth(), 2);
    startOfMonth.setUTCHours(0, 0, 0, 0);

    // const currentDate = new Date();
    // const sixteenDaysAgo = new Date(currentDate.getTime() - 16 * 24 * 60 * 60 * 1000);
    // sixteenDaysAgo.setHours(0, 0, 0, 0);


    // const activeUsers = await this.usersRepository
    //   .createQueryBuilder("user")
    //   .select("DATE(user.createdDate) as date")
    //   .addSelect("COUNT(*) as count")
    //   .innerJoin("user.role", "role", "role.name = :roleName", { roleName: RoleEnum.USER })
    //   .innerJoin("user.status", "status", "status.statusName = :statusName", { statusName: StatusEnum.Active })
    //   .where("user.createdDate >= :sixteenDaysAgo", { sixteenDaysAgo: sixteenDaysAgo })
    //   .groupBy("date")
    //   .getRawMany();

    
    
    // query to get the counts of user logs for the current month
    const onlineUsers = await UserLoginLogs.createQueryBuilder('logs')
      .select("to_char(logs.loginDate, 'YYYY-MM-DDT00:00:00.000Z') as date")
      .addSelect('COUNT(*)', 'count')
      .where('Logs.login_date >= :startOfMonth', { startOfMonth })
      .groupBy('date')
      .getRawMany();

    const newUsers = await this.usersRepository
      .createQueryBuilder("user")
      .select("to_char(user.createdDate, 'YYYY-MM-DDT00:00:00.000Z') as date")
      .addSelect("COUNT(*) as count")
      .innerJoin("user.role", "role", "role.name = :roleName", { roleName: RoleEnum.USER })
      .where("user.createdDate >= :startOfMonth", { startOfMonth })
      .groupBy("date")
      .getRawMany();

    const bannedUsers = await this.usersRepository
      .createQueryBuilder("user")
      .select("to_char(user.createdDate, 'YYYY-MM-DDT00:00:00.000Z') as date")
      .addSelect("COUNT(*) as count")
      .innerJoin("user.role", "role", "role.name = :roleName", { roleName: RoleEnum.USER })
      .innerJoin("user.status", "status", "status.statusName = :statusName", { statusName: StatusEnum.Inactive })
      .where("user.createdDate >= :startOfMonth", { startOfMonth })
      .groupBy("date")
      .getRawMany();

    return { onlineUsers: onlineUsers, newUsers: newUsers, bannedUsers: bannedUsers };
  }

  async getUserCount() {
    const allUsers = await this.usersRepository.find({});
    return {
      signup_users: await this.usersRepository.count({
        relations: ['role'],
        where: { role: { name: RoleEnum.USER } }
      }),
      active_users: await this.usersRepository.count({
        relations: ['status', 'role'],
        where: {
          role: {
            name: RoleEnum.USER
          },
          status: {
            statusName: StatusEnum.Active,
          },
        },
      }),
      inactive_users: await this.usersRepository.count({
        relations: ['status', 'role'],
        where: {
          role: {
            name: RoleEnum.USER
          },
          status: {
            statusName: StatusEnum.Inactive,
          },
        },
      }),
    };
  }


  async getDataByCreatedDate(createdDate: string) {
    const startOfDay = new Date(createdDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const users = await this.usersRepository.find({
      relations: ['role'],

      where: {
        role: { name: RoleEnum.USER },
        createdDate: Between(startOfDay, endOfDay)
      }
    });
    if (!users) {
      throw new NotFoundException({ message: "Users Not Found" })
    }
    const tenMinutesBefore = new Date();
    tenMinutesBefore.setMinutes(tenMinutesBefore.getMinutes() - 10);
    const data = users.map((obj) => {
      const container: {
        firstName: string;
        lastName: string;
        gender: string;
        phoneNo: string;
        picture: string;
        email: string;
        dateOfBirth: Date;
        onlineStatus: boolean;
        location: string;
        locationTwo: string;
        accountStatus: string;
        frontImage: string;
        backImage: string
      } = {
        firstName: obj.firstName,
        lastName: obj.lastName,
        gender: obj.gender,
        phoneNo: obj.phoneNo,
        picture: obj.picture,
        email: obj.email,
        dateOfBirth: obj.birthDate,
        onlineStatus: obj.updatedDate > tenMinutesBefore,
        location: obj.addressOne,
        locationTwo: obj.addressTwo,
        accountStatus: obj.status.statusName,
        frontImage: obj.frontImage,
        backImage: obj.backImage

      };
      return container;
    });
    return data;
  }

  async downloadDashboardEntities() {

    const users = await this.usersRepository.find({
      relations: ['role'],
      where: {
        role: {
          name: RoleEnum.USER,
        },
      },
    });
    const tenMinutesBefore = new Date();
    tenMinutesBefore.setMinutes(tenMinutesBefore.getMinutes() - 10);
    const data = users.map((obj) => {
      const container: {
        firstName: string;
        lastName: string;
        gender: string;
        phoneNo: string;
        picture: string;
        email: string;
        dateOfBirth: Date;
        onlineStatus: boolean;
        addressOne: string;
        addressTwo: string;
        accountStatus: string;
        frontImage: string;
        backImage: string
      } = {
        firstName: obj.firstName,
        lastName: obj.lastName,
        gender: obj.gender,
        phoneNo: obj.phoneNo,
        picture: obj.picture,
        email: obj.email,
        dateOfBirth: obj.birthDate,
        onlineStatus: obj.updatedDate > tenMinutesBefore,
        addressOne: obj.addressOne,
        addressTwo: obj.addressTwo,
        accountStatus: obj.status.statusName,
        frontImage: obj.frontImage,
        backImage: obj.backImage
      };
      return container;
    });
    return data;
  }

  async selfieVerificationStatus(res: boolean, user_id: string) {
    const user = await this.usersRepository.findOne({
      where: {
        id: user_id
      }
    })
    if (user) {
      user.selfie_verified = true;
      return await user.save();

    }
  }
}
