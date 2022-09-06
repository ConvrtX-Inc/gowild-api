import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RouteHistoricalEvent } from './entities/route-historical-event.entity';

@Injectable()
export class RouteHistoricalEventsService extends TypeOrmCrudService<RouteHistoricalEvent> {
  constructor(@InjectRepository(RouteHistoricalEvent)
              private routeHistoricalEventRepository: Repository<RouteHistoricalEvent>,
  ) {
    super(routeHistoricalEventRepository);
  }
}
