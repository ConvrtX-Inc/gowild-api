import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { Password } from './password.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { UserEntity } from './user.entity';
import {FindOptions} from "../common/types/find-options.type";

@Injectable()
export class PasswordService extends TypeOrmCrudService<Password> {
  constructor(
    @InjectRepository(Password)
    private readonly repository: Repository<Password>,
  ) {
    super(repository);
  }

  public async generatePassword(
    user: UserEntity,
    password: string,
  ): Promise<Password> {
    const { salt, hash } = await this.hash(password);
    const entity = new Password();
    entity.hashedValue = hash;
    entity.algorithm = 'bcrypt';
    entity.user = user;
    entity.status = 'true';
    entity.metaData = JSON.stringify({ salt });
    return entity;
  }

  public async hash(raw: string): Promise<{ hash: string; salt: string }> {
    const salt = await bcrypt.genSalt();
    return { hash: await bcrypt.hash(raw, salt), salt };
  }

  public async compare(raw: string, hashed: string): Promise<boolean> {
    return await bcrypt.compare(raw, hashed);
  }

  public async verifyPassword(
    user: UserEntity,
    password: string,
  ): Promise<boolean> {
    const previous = await this.findPrevious(user);
    if (previous === null) {
      return false;
    }

    return await this.compare(password, previous.hashedValue);
  }

  async createPassword(user: UserEntity, password: string): Promise<void> {
    const previous = await this.findPrevious(user);
    if (previous !== null) {
      previous.status = 'false';
      await this.repository.save(previous);
    }

    const entity = await this.generatePassword(user, password);

    await this.repository.save(entity);
  }


  private async findPrevious(user: UserEntity): Promise<Password | null> {
    const found = await this.repository.findOne({
      where: { user, status: 'true' },
    });
    if (found) {
      return found;
    }
    return null;
  }


}
