import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Sponsor } from './entities/sponsor.entity';
import { Repository } from 'typeorm';


@Injectable()
export class SponsorService extends TypeOrmCrudService<Sponsor>{
  constructor(@InjectRepository(Sponsor)
  private sponsorRepository: Repository<Sponsor>,
  ){
    super(sponsorRepository);
  }


}
