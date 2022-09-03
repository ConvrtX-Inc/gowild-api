import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { DeepPartial } from '../../utils/types/deep-partial.type';
import { FindOptions } from '../../utils/types/find-options.type';

import { Participant } from './participant.entity';

@Injectable()
export class ParticipantService extends TypeOrmCrudService<Participant> {
  constructor(
    @InjectRepository(Participant)
    private participantRepository: Repository<Participant>,
  ) {
    super(participantRepository);
  }

  async findOneEntity(options: FindOptions<Participant>) {
    return this.participantRepository.findOne({
      where: options.where,
    });
  }

  async findManyEntities(options: FindOptions<Participant>) {
    return this.participantRepository.find({
      where: options.where,
    });
  }

  async saveOne(data) {
    return await this.saveEntity(data);
  }

  async saveEntity(data: DeepPartial<Participant>[]) {
    return this.participantRepository.save(
      this.participantRepository.create(data),
    );
  }

  async delete(id: number): Promise<void> {
    await this.participantRepository.delete(id);
  }
}
