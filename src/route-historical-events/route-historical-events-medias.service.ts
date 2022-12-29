import { Injectable, NotFoundException } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RouteHistoricalEventMedias } from './entities/route-historical-event-medias.entity';
import { RouteHistoricalEvent } from './entities/route-historical-event.entity';

@Injectable()
export class RouteHistoricalEventMediasService extends TypeOrmCrudService<RouteHistoricalEventMedias>{
    constructor(
        @InjectRepository(RouteHistoricalEventMedias)
        private readonly Repository: Repository<RouteHistoricalEventMedias>,
        
      ) {
        super(Repository);
      }


      public async updatePicture(
        routeHistoricalEvent: RouteHistoricalEvent,
        picture: string
      ): Promise<RouteHistoricalEventMedias>{
        const entity = new RouteHistoricalEventMedias();
        entity.picture = picture
        entity.routeHistoricalEvent = routeHistoricalEvent
        return await this.Repository.save(entity);
        


      }
}