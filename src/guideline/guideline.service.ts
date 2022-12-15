import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptions } from '../common/types/find-options.type';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { DeepPartial } from '../common/types/deep-partial.type';
import { Guideline } from './guideline.entity';
import { GuidelineLogsService } from 'src/guideline-logs/guideline-logs.service';
import { GuidelineLog } from 'src/guideline-logs/guideline-log.entity';
import { CreateGuidelineDto } from './dtos/Create.dto';
import { GuidelineTypesEnum } from './guideline.enum';
import { UserEntity } from 'src/users/user.entity';

@Injectable()
export class GuidelineService extends TypeOrmCrudService<Guideline> {
  constructor(
    @InjectRepository(Guideline)
    private guidelinesRepository: Repository<Guideline>,
    private guidelineLogsService: GuidelineLogsService,
  ) {
    super(guidelinesRepository);
  }

  async createOneGuideline(body:CreateGuidelineDto, req:UserEntity){
    
    const isExist = await this.guidelinesRepository.findOne({
      where : { type : body.type }
    })
    if(isExist){
        
    }

  }
  async findOneEntity(options: FindOptions<Guideline>) {
    return this.guidelinesRepository.findOne({
      where: options.where,
    });
  }

  async findManyEntities(options: FindOptions<Guideline>) {
    return this.guidelinesRepository.find({
      where: options.where,
    });
  }

  async saveOne(data) {
    const result = await this.saveEntity(data);
    const logData = new GuidelineLog();
    logData.guideline_type = data.type;
    logData.userId = data.last_updated_user;
    await this.guidelineLogsService.saveOne(logData);
    return result;
  }

  async saveEntity(data: DeepPartial<Guideline>[]) {
    return this.guidelinesRepository.save(
      this.guidelinesRepository.create(data),
    );
  }

  async softDelete(id: string): Promise<void> {
    await this.guidelinesRepository.softDelete(id);
  }

  async hardDelete(id) {
    await this.guidelinesRepository.delete(id);
  }

  async getTermsByType(type: string) {
    return this.guidelinesRepository.find({
      where: {
        type: type,
      },
    });
  }
}
