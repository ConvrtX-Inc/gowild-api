import { Injectable, NotFoundException } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RouteHistoricalEvent } from './entities/route-historical-event.entity';
import { FilesService } from '../files/files.service';

@Injectable()
export class RouteHistoricalEventsService extends TypeOrmCrudService<RouteHistoricalEvent> {
  constructor(
    @InjectRepository(RouteHistoricalEvent)
    private readonly routeHistoricalEventRepository: Repository<RouteHistoricalEvent>,
    private readonly filesService: FilesService,
  ) {
    super(routeHistoricalEventRepository);
  }

  public async updatePicture(id: string, fileId: string) {
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

    route.image = await this.filesService.fileById(fileId);
    return await route.save();
  }

  public async updateMedias(id: string, fileIds: string[]) {
    const routeClue = await this.routeHistoricalEventRepository.findOne(id);

    if (!routeClue) {
      throw new NotFoundException({
        errors: [
          {
            user: 'routeClue do not exist',
          },
        ],
      });
    }

    const values = fileIds.map((fileId) => this.filesService.fileById(fileId));
    routeClue.medias = await Promise.all(values);
    return await routeClue.save();
  }
}
