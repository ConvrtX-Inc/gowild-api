import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { Password } from '../password';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm/lib/typeorm-crud.service';
import { User } from '../user';

@Injectable()
export class PasswordService extends TypeOrmCrudService<Password> {
  constructor(
    @InjectRepository(Password)
    private readonly repository: Repository<Password>,
  ) {
    super(repository);
  }

  async verifyPassword(user: User, password: string): Promise<boolean> {
    const previous = await this.findPrevious(user);
    if (previous === null) {
      return false;
    }

    return await bcrypt.compare(password, previous.hashedValue);
  }

  async createPassword(user: User, password: string): Promise<void> {
    const previous = await this.findPrevious(user);
    if (previous !== null) {
      previous.status = 'false';
      await this.repository.save(previous);
    }

    const entity = await PasswordService.generatePassword(user, password);
    await this.repository.save(entity);
  }

  public static async generatePassword(
    user: User,
    password: string,
  ): Promise<Password> {
    const salt = await bcrypt.genSalt();
    const entity = new Password();
    entity.hashedValue = await bcrypt.hash(password, salt);
    entity.algoritm = 'bcrypt';
    entity.user = user;
    entity.status = 'true';
    entity.metaData = JSON.stringify({ salt });
    return entity;
  }

  private async findPrevious(user: User): Promise<Password | null> {
    const found = await this.repository.findOne({
      where: { user, status: 'true' },
    });
    if (found) {
      return found;
    }
    return null;
  }
}
