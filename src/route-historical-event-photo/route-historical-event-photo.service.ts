import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RouteHistoricalEventPhoto } from './entities/route-historical-event-photo.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RouteHistoricalEventPhotoService extends TypeOrmCrudService<RouteHistoricalEventPhoto> {
  constructor(@InjectRepository(RouteHistoricalEventPhoto)
              private RouteHistoricalEventPhotoRepository: Repository<RouteHistoricalEventPhoto>,
  ) {
    super(RouteHistoricalEventPhotoRepository);
  }
}
