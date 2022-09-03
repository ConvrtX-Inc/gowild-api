import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Repository } from 'typeorm';
import { RouteClue } from './entities/route-clue.entity';

@Injectable()
export class RouteCluesService extends TypeOrmCrudService<RouteClue> {
  constructor(@InjectRepository(RouteClue)
              private routeClueRepository: Repository<RouteClue>,
  ) {
    super(routeClueRepository);
  }

  async allClues(route_id: string) {
    const postAllClues = await this.routeClueRepository.find({
      where: { route_id: route_id },
    });
    return postAllClues;
  }
}
