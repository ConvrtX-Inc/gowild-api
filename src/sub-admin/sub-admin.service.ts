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
import { getConnection, Repository } from 'typeorm';
import { CreateSubAdminDto } from './dto/create-sub-admin.dto';
import { Password } from '../users/password.entity';

@Injectable()
export class SubAdminService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    private readonly usersService: UsersService,
    private readonly passwordService: PasswordService,
    private readonly statusService: StatusService,
    private readonly roleService: RoleService,
  ) {}

  async mapListingsData(dataArray) {
    const tenMinutesBefore = new Date();
    tenMinutesBefore.setMinutes(tenMinutesBefore.getMinutes() - 10);

    const data = dataArray.map((obj) => {
      const container: {
        id: string;
        username: string;
        firstName: string;
        lastName: string;
        email: string;
        dateOfBirth: Date;
        onlineStatus: boolean;
        picture: string;
        location: string;
        accountStatus: string;
      } = {
        id: obj.id,
        firstName: obj.firstName,
        lastName: obj.lastName,
        username: obj.username,
        email: obj.email,
        dateOfBirth: obj.birthDate,
        onlineStatus: obj.updatedDate > tenMinutesBefore ? true : false,
        picture: obj.picture,
        location: `${obj.addressOne},${obj.addressTwo}`,
        accountStatus: obj.status.statusName,
      };
      return container;
    });
    return data;
  }

  public async registerSubAdmin(dto: CreateSubAdminDto) {
    let entity = new UserEntity();
    entity.firstName = dto.firstName;
    entity.lastName = dto.lastName;
    entity.gender = dto.gender;
    entity.email = dto.email;
    entity.username = dto.username;
    entity.phoneNo = dto.phoneNo;
    entity.addressOne = dto.addressOne;
    entity.birthDate = dto.birthDate;
    entity.phoneVerified = false;

    entity.status = await this.statusService.findByEnum(StatusEnum.Active);
    entity.role = await this.roleService.findByEnum(RoleEnum.ADMIN);
    entity = await this.usersService.saveEntity(entity);

    const temporaryPassword = entity.getTemporaryPassword;
    await this.passwordService.createPassword(entity, temporaryPassword);

    return {
      temporaryPassword: temporaryPassword,
      userData: entity,
    };
  }

  async regeneratePassword(id: string) {
    const admin = await this.usersRepository.findOne({
      where: { id: id },
    });

    if (!admin) {
      throw new NotFoundException({
        errors: [
          {
            user: 'Admin do not exist',
          },
        ],
      });
    }
    const temporaryPassword = `gowild@${Math.floor(
      1000 + Math.random() * 9000,
    )}`;
    await this.passwordService.createPassword(admin, temporaryPassword);

    return {
      temporaryPassword: temporaryPassword,
      userData: admin,
    };
  }

  public async updateSubAdmin(
    id: string,
    dto: UpdateUserDto,
  ): Promise<UserEntity> {
    const admin = await this.usersRepository.findOne({
      where: { id: id },
    });

    if (!admin) {
      throw new NotFoundException({
        errors: [
          {
            user: 'Admin do not exist',
          },
        ],
      });
    }

    admin.firstName = dto.firstName;
    admin.lastName = dto.lastName;
    admin.birthDate = dto.birthDate;
    admin.addressOne = dto.addressOne;
    admin.username = dto.username;

    await admin.save();
    return admin;
  }

  async findOneSubAdmin(id: string) {
    const admin = await this.usersRepository.findOne({
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
      dateOfBirth: Date;
      onlineStatus: boolean;
      location: string;
      accountStatus: string;
    } = {
      id: id,
      firstName: admin.firstName,
      lastName: admin.lastName,
      username: admin.username,
      email: admin.email,
      dateOfBirth: admin.birthDate,
      onlineStatus: admin.updatedDate > tenMinutesBefore ? true : false,
      location: `${admin.addressOne}`,
      accountStatus: admin.status.statusName,
    };
    return container;
  }

  async findAllSubAdmin() {
    const tenMinutesBefore = new Date();
    tenMinutesBefore.setMinutes(tenMinutesBefore.getMinutes() - 10);

    const admins = await this.usersRepository.find({
      relations: ['role'],
      where: {
        role: {
          name: RoleEnum.ADMIN,
        },
      },
    });
    return await this.mapListingsData(admins);
  }

  async deleteSubAdmin(id: string) {
    const userData = await this.usersRepository.findOne(id);
    if (userData) {
      await getConnection()
        .createQueryBuilder()
        .delete()
        .from(Password)
        .where('user_id = :id', { id: userData.id })
        .execute();

      await getConnection()
        .createQueryBuilder()
        .delete()
        .from(UserEntity)
        .where('id = :id', { id: userData.id })
        .execute();

      return {
        message: 'User deleted',
      };
    } else {
      return { message: 'User not deleted' };
    }
  }

  async fiterSubAdmin(filter: string) {
    const admins = await this.usersRepository
      .createQueryBuilder('user')

      .select([
        'user.email',
        'user.username',
        'user.updatedDate',
        'user.firstName',
        'user.lastName',
        'user.addressOne',
        'user.addressTwo',
      ])
      .innerJoin('user.role', 'role', 'role.name = :name', {
        name: RoleEnum.ADMIN,
      })
      .leftJoinAndSelect('user.status', 'status')
      .orWhere("user.firstName like '%' || :filter || '%'", { filter: filter })
      .orWhere("user.lastName like '%' || :filter || '%'", { filter: filter })
      .orWhere("user.email like '%' || :filter || '%'", { filter: filter })
      .getMany();

    return await this.mapListingsData(admins);
  }

  async activeInactive(key: boolean) {
    const admins = await this.usersRepository.find({
      relations: ['role', 'status'],
      where: {
        role: {
          name: RoleEnum.ADMIN,
        },
        status: {
          statusName: key === true ? StatusEnum.Active : StatusEnum.Inactive,
        },
      },
    });

    return await this.mapListingsData(admins);
  }

  async changeStatus(id: string) {
    const user = await this.usersRepository.findOne({ id: id });
    if (!user) {
      throw new NotFoundException({ message: 'User Not Found!' });
    }
    const userStatus = user.status.statusName;
    if (userStatus === StatusEnum.Active) {
      user.status = await this.statusService.findByEnum(StatusEnum.Inactive);
      await user.save();
      return { message: 'User status Changed Successfully! (Disabled)' };
    } else {
      user.status = await this.statusService.findByEnum(StatusEnum.Active);
      await user.save();
      return { message: 'User status Changed Successfully! (Active)' };
    }
  }
}
