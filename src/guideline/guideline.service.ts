import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptions } from '../utils/types/find-options.type';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { DeepPartial } from '../utils/types/deep-partial.type';
import { Guideline } from './guideline.entity';

@Injectable()
export class GuidelineService extends TypeOrmCrudService<Guideline> {
  constructor(
    @InjectRepository(Guideline)
    private GuidelinesRepository: Repository<Guideline>,
  ) {
    super(GuidelinesRepository);
  }

  async findOneEntity(options: FindOptions<Guideline>) {
    return this.GuidelinesRepository.findOne({
      where: options.where,
    });
  }

  async findManyEntities(options: FindOptions<Guideline>) {
    return this.GuidelinesRepository.find({
      where: options.where,
    });
  }

  async saveOne(data) {
    return await this.saveEntity(data);
  }

  async saveEntity(data: DeepPartial<Guideline>[]) {
    return this.GuidelinesRepository.save(
      this.GuidelinesRepository.create(data),
    );
  }

  async softDelete(id: number): Promise<void> {
    await this.GuidelinesRepository.softDelete(id);
  }

  async hardDelete(id) {
    await this.GuidelinesRepository.delete(id);
  }

  async getTermsByType(type: string) {
    return this.GuidelinesRepository.find({
      where: {
        type: type,
      },
    });
  }
}
