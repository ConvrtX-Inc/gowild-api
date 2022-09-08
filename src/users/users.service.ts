import { Injectable, NotFoundException } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FindOptions } from 'src/utils/types/find-options.type';
import { DeepPartial } from 'src/utils/types/deep-partial.type';
import { StatusEnum } from 'src/auth/status.enum';
import { MailService } from 'src/mail/mail.service';
import { StatusService } from '../statuses/status.service';
import { FilesService } from '../files/files.service';

@Injectable()
export class UsersService extends TypeOrmCrudService<User> {
  constructor(
    private readonly mailService: MailService,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly statusService: StatusService,
    private readonly filesService: FilesService,
  ) {
    super(usersRepository);
  }

  async findOneEntity(options: FindOptions<User>): Promise<User | null> {
    const user = await this.usersRepository.findOne({
      where: options.where,
      relations: ['picture']
    });
    if (user) {
      return user;
    }
    return null;
  }

  async findManyEntities(options: FindOptions<User>) {
    return this.usersRepository.find({
      where: options.where,
      relations: ['picture']
    });
  }

  async saveEntity(data: DeepPartial<User>) {
    return this.usersRepository.save(this.usersRepository.create(data));
  }

  async softDelete(id: string): Promise<void> {
    await this.usersRepository.softDelete(id);
  }

  async updateUserStatus(id: string, statusEnum: StatusEnum): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id: id },
      relations: ['picture']
    });
    if (!user) {
      throw new NotFoundException({
        errors: [
          {
            user: 'user do not exist',
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

  public async updateAvatar(id: string, fileId: string) {
    const user = await this.usersRepository.findOne({
      where: { id: id },
      relations: ['picture']
    });

    if (!user) {
      throw new NotFoundException({
        errors: [
          {
            user: 'user do not exist',
          },
        ],
      });
    }

    user.picture = await this.filesService.fileById(fileId);
    await user.save();
  }
}
