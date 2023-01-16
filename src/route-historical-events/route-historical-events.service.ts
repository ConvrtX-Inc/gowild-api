import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RouteHistoricalEvent } from './entities/route-historical-event.entity';
import { FilesService } from '../files/files.service';
import { RouteHistoricalEventMedias } from './entities/route-historical-event-medias.entity';
import { RouteHistoricalEventMediasService } from './route-historical-events-medias.service';
import { CreateRouteHistoricalEventDto } from './dto/create-route-historical-event.dto';
import { UpdateRouteDto } from '../route/dto/update-route.dto';
import { UpdateRouteHistoricalEventDto } from './dto/update-route-historical-event.dto';
import { NotFoundException } from 'src/exceptions/not-found.exception';

@Injectable()
export class RouteHistoricalEventsService extends TypeOrmCrudService<RouteHistoricalEvent> {
  constructor(
    @InjectRepository(RouteHistoricalEvent)
    private readonly routeHistoricalEventRepository: Repository<RouteHistoricalEvent>,
    private readonly mediaService: RouteHistoricalEventMediasService,
  ) {
    super(routeHistoricalEventRepository);
  }

  public async createHistoricalEvent(
    routeId: any,
    dto: CreateRouteHistoricalEventDto,
  ) {
    const route = await this.routeHistoricalEventRepository.findOne(routeId);
    if (!route) {
      throw new NotFoundException({
        message: `Route with ID ${routeId} not found!`,
      });
    }
    return await this.routeHistoricalEventRepository.save(
      this.routeHistoricalEventRepository.create({ route: routeId, ...dto }),
    );
  }

  public async getAllHistoricalEvents() {
    const hEvents = await this.routeHistoricalEventRepository.find({});

    if (!hEvents) {
      throw new NotFoundException({
        errors: [
          {
            message: 'Historical Event Routes not found!',
          },
        ],
      });
    }
    return hEvents;
  }

  async getOneHistoricalEvent(id: string) {
    const getRoute = await this.routeHistoricalEventRepository.findOne({ id });

    if (!getRoute) {
      throw new NotFoundException({
        errors: [
          {
            message: 'Historical Event Route not found!',
          },
        ],
      });
    }
    return getRoute;
  }

  async updateOneHistoricalEvent(
    id: string,
    dto: UpdateRouteHistoricalEventDto,
  ) {
    await this.routeHistoricalEventRepository
      .createQueryBuilder()
      .update()
      .set(dto)
      .where('id = :id', { id })
      .execute();

    const historicalRoute = await this.routeHistoricalEventRepository.findOne({
      where: { id: id },
    });
    return historicalRoute;
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
    return {
      message: 'Picture Updated Successfully!',
      data: await route.save(),
    };
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
