import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { SocialAccount } from './social-account.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { DeepPartial } from '../common/types/deep-partial.type';

@Injectable()
export class SocialAccountService extends TypeOrmCrudService<SocialAccount> {
  constructor(
    @InjectRepository(SocialAccount)
    private socialAccountsRepository: Repository<SocialAccount>,
  ) {
    super(socialAccountsRepository);
  }

  async saveEntity(data: DeepPartial<SocialAccount>) {
    return this.socialAccountsRepository.save(
      this.socialAccountsRepository.create(data),
    );
  }
}
