import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Repository } from 'typeorm';
import { RouteClue } from './entities/route-clue.entity';
import { FilesService } from '../files/files.service';

@Injectable()
export class RouteCluesService extends TypeOrmCrudService<RouteClue> {
  constructor(
    @InjectRepository(RouteClue)
    private readonly routeClueRepository: Repository<RouteClue>,
    private readonly filesService: FilesService,
  ) {
    super(routeClueRepository);
  }

  async allClues(route_id: string) {
    return await this.routeClueRepository.find({
      where: { route_id: route_id },
    });
  }

  public async updateMedias(id: string, fileIds: string[]) {
    const routeClue = await this.routeClueRepository.findOne({
      where: { id: id },
    });

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
