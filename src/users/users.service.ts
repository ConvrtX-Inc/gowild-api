import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { User } from './user';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FindOptions } from 'src/utils/types/find-options.type';
import { DeepPartial } from 'src/utils/types/deep-partial.type';
import { StatusEnum } from 'src/auth/status.enum';
import { MailService } from 'src/mail/mail.service';
import { StatusService } from '../statuses/status.service';

@Injectable()
export class UsersService extends TypeOrmCrudService<User> {
  constructor(
    private readonly mailService: MailService,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly statusService: StatusService,
  ) {
    super(usersRepository);
  }

  async findOneEntity(options: FindOptions<User>): Promise<User | null> {
    const user = await this.usersRepository.findOne({
      where: options.where,
    });
    if (user) {
      return user;
    }
    return null;
  }

  async findManyEntities(options: FindOptions<User>) {
    return this.usersRepository.find({
      where: options.where,
    });
  }

  async saveEntity(data: DeepPartial<User>) {
    return this.usersRepository.save(this.usersRepository.create(data));
  }

  async softDelete(id: number): Promise<void> {
    await this.usersRepository.softDelete(id);
  }

  async updateUserStatus(id: string, status: StatusEnum) {
    const user = await this.usersRepository.findOne({
      where: { id: id },
    });
    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            user: 'user do not exist',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    } else {
      user.status = await this.statusService.findByEnum(status);
      await user.save();

      await this.mailService.userUpdateStatus(
        {
          to: user.email,
          name: user.fullName,
          data: {},
        },
        status,
      );

      return {
        status: HttpStatus.OK,
        user: user,
      };
    }
  }
}
