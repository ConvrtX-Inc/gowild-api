import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { DeepPartial } from 'src/utils/types/deep-partial.type';
import { FindOptions } from 'src/utils/types/find-options.type';
import { Repository } from 'typeorm';
import { Route } from './entities/route.entity';

@Injectable()
export class RouteService extends TypeOrmCrudService<Route>{
  constructor(@InjectRepository(Route)
  private routeRepository: Repository<Route>,
  ){
    super(routeRepository);
  }

  async findOneEntity(options: FindOptions<Route>) {
    return this.routeRepository.findOne({
      where: options.where,
    });
  }

  async findManyEntities(options: FindOptions<Route>) {
    return this.routeRepository.find({
      where: options.where,
    });
  }

  async saveOne(data) {
    return await this.saveEntity(data);
  }

  async saveEntity(data: DeepPartial<Route>[]) {
    return this.routeRepository.save(
      this.routeRepository.create(data),
    );
  }

  async softDelete(id: number): Promise<void> {
    await this.routeRepository.softDelete(id);
  }

  async hardDelete(id) {
    await this.routeRepository.delete(id);
  }
}
