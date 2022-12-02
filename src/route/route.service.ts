import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {TypeOrmCrudService} from '@nestjsx/crud-typeorm';
import {DeepPartial} from 'src/common/types/deep-partial.type';
import {FindOptions} from 'src/common/types/find-options.type';
import {Repository} from 'typeorm';
import {Route} from './entities/route.entity';
import {FilesService} from '../files/files.service';
import {CreateRouteDto} from "./dto/create-route.dto";
import {RoleEnum} from "../roles/roles.enum";

@Injectable()
export class RouteService extends TypeOrmCrudService<Route> {
  constructor(
    @InjectRepository(Route)
    private readonly routeRepository: Repository<Route>,
    private readonly filesService: FilesService
  ) {
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
    return this.routeRepository.save(this.routeRepository.create(data));
  }

  async softDelete(id: string): Promise<void> {
    await this.routeRepository.softDelete(id);
  }

  async hardDelete(id) {
    await this.routeRepository.delete(id);
  }

  public async updatePicture(id: string, fileId: string) {
    const route = await this.routeRepository.findOne({
      where: { id: id },
    });

    if (!route) {
      throw new NotFoundException({
        errors: [
          {
            user: 'route do not exist',
          },
        ],
      });
    }

    route.picture = await this.filesService.fileById(fileId);
    return await route.save();
  }

  public async create(userId: string, dto: CreateRouteDto) {
    // @ts-ignore
    return this.routeRepository.save(this.routeRepository.create({user_id: userId, role: RoleEnum.USER, ...dto}));
  }
}
