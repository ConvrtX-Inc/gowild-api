import {HttpStatus, Injectable, NotFoundException} from '@nestjs/common';
import {Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {FindOptions} from '../common/types/find-options.type';
import {TypeOrmCrudService} from '@nestjsx/crud-typeorm';
import {DeepPartial} from '../common/types/deep-partial.type';
import {Guideline} from './guideline.entity';
import {GuidelineLogsService} from 'src/guideline-logs/guideline-logs.service';
import {GuidelineLog} from 'src/guideline-logs/guideline-log.entity';
import {CreateGuidelineDto} from './dtos/Create.dto';
import {GuidelineTypesEnum} from './guideline.enum';

@Injectable()
export class GuidelineService extends TypeOrmCrudService<Guideline> {
  constructor(
    @InjectRepository(Guideline)
    private guidelinesRepository: Repository<Guideline>,
    private guidelineLogsService: GuidelineLogsService,
  ) {
    super(guidelinesRepository);
  }

  async createOneGuideline(dto: CreateGuidelineDto, req: any) {
    const entity = new Guideline();
    entity.type = dto.type;
    entity.description = dto.description;
    entity.last_updated_user = req;

    const searchData = await this.guidelinesRepository.findOne({where:{ type: dto.type}})

    if(dto.type === GuidelineTypesEnum.FAQ) {
      entity.question = dto.question;
      if (!dto.question){
        throw new NotFoundException({message: "Question is Missing, Please enter a Question!"})
      }
    }
    else if (
      dto.type === GuidelineTypesEnum.HUNT_E_WAIVER ||
      GuidelineTypesEnum.E_WAIVER ||
      GuidelineTypesEnum.TERMS_CONDITIONS
    ) {
      if (searchData){
        await this.guidelinesRepository.update(searchData.id,entity)
        const logData = new GuidelineLog();
        logData.guideline_type = entity.type;
        logData.userId = entity.last_updated_user;
        const saveLog = await this.guidelineLogsService.saveOne(logData);

        return {
          status: HttpStatus.OK,
          message: 'Admin Guideline Updated successfully!',
          data: saveLog,
        };
      }
    } else {
      throw new NotFoundException({
        message: `Admin Guideline cannot be added!`,
      });
    }

    await entity.save();
    const logData = new GuidelineLog();
    logData.guideline_type = entity.type;
    logData.userId = entity.last_updated_user;
    const saveLog = await this.guidelineLogsService.saveOne(logData);

    return {
      status: HttpStatus.OK,
      message: 'Admin Guideline added successfully!',
      data: saveLog,
    };
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

  async saveEntity(data: DeepPartial<Guideline>) {
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

    if(type === GuidelineTypesEnum.FAQ){

      const getFaqTerms = await this.guidelinesRepository.find({
        where: {
          type: type,
        },
      })
      return{ data: null, faq: getFaqTerms }
    }else{
      const getTerms = await this.guidelinesRepository.findOne({
        where: {
          type: type,
        },
      })
      return{data: getTerms, faq: []}
    }


  }
  public async findByEnum(guidelineEnum: GuidelineTypesEnum) {
    return this.guidelinesRepository.findOne({
      where: { type: guidelineEnum },
    });
  }
}
