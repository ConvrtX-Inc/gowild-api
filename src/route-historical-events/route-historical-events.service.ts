import { Injectable, NotFoundException } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RouteHistoricalEvent } from './entities/route-historical-event.entity';
import { FilesService } from '../files/files.service';
import { RouteHistoricalEventMedias } from './entities/route-historical-event-medias.entity';
import { RouteHistoricalEventMediasService } from './route-historical-events-medias.service';

@Injectable()
export class RouteHistoricalEventsService extends TypeOrmCrudService<RouteHistoricalEvent> {
  constructor(
    @InjectRepository(RouteHistoricalEvent)
    private readonly routeHistoricalEventRepository: Repository<RouteHistoricalEvent>,
    private readonly mediaService: RouteHistoricalEventMediasService,
  ) {
    super(routeHistoricalEventRepository);
  }

  public async updatePicture(id: string, image: string) {
    const route = await this.routeHistoricalEventRepository.findOne(id);

    if (!route) {
      throw new NotFoundException({
        errors: [
          {
            user: 'route do not exist',
          },
        ],
      });
    }

    route.image = image;
    return{ message: "Picture Updated Successfully!", data: await route.save()};
  }

  public async updateMedias(id: string, picture: string) {
    const event = await this.routeHistoricalEventRepository.findOne(id);

    if (!event) {
      throw new NotFoundException({
        errors: [
          {
            user: 'event do not exist',
          },
        ],
      });
    }
    return await this.mediaService.updatePicture(event, picture);
  }
}
