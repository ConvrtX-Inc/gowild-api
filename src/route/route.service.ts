import { Injectable, NotFoundException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { DeepPartial } from 'src/common/types/deep-partial.type';
import { FindOptions } from 'src/common/types/find-options.type';
import { Not, Repository } from 'typeorm';
import { Route } from './entities/route.entity';
import { FilesService } from '../files/files.service';
import { CreateRouteDto } from "./dto/create-route.dto";
import { RoleEnum } from "../roles/roles.enum";
import { FileEntity } from "../files/file.entity";
import { UserEntity } from "../users/user.entity";
import { Status } from "../statuses/status.entity";
import { SaveRouteDto } from './dto/save-route-dto';
import { SavedRoute } from './entities/saved-routs.entity';
import { defaultPath } from 'tough-cookie';

@Injectable()
export class RouteService extends TypeOrmCrudService<Route> {
  constructor(
    @InjectRepository(Route)
    private readonly routeRepository: Repository<Route>,
    @InjectRepository(SavedRoute)
    private readonly saveRouteRepository: Repository<SavedRoute>,
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

  // To Get Many Routes with user_id and saved = true/false
  async getManyRoute(id: string, saved: any) {
    console.log(typeof (saved));
    if (saved == "true") {
      const saved = await this.routeRepository.find({
        user_id: id,
        saved: true
      });
      return { data: saved }

    } else if (saved == "false") {
      const unsaved = await this.routeRepository.find({
        user_id: id,
        saved: false
      });
      return { data: unsaved }
    } else {
      const all = await this.routeRepository.find({
        user_id: id
      })
      return { data: all }
    }
  }

  // Get All Admin Routes
  public async getAdminRoutes() {
    const routes = await this.routeRepository.find({
      role: Not(RoleEnum.USER)
    })
    if (!routes) {
      return {
        error: [{ message: "No routes found" }]
      };
    }
    return {

      message: "Admin routes successfully fetched!",
      data: routes
    };
  }

  public async getUserRoutes() {

    const routes = await this.routeRepository.createQueryBuilder('route')
      .where("route.role = role", { role: RoleEnum.USER })
      .leftJoinAndMapOne('route.user', UserEntity, 'user', 'user.id = route.user_id')
      .leftJoinAndMapOne('user.status', Status, 'status', 'status.id = user.status_id')
      .getMany()


    if (!routes) {
      return {
        error: [{ message: "No routes found" }]
      };
    }
    return {

      message: "Admin routes successfully fetched!",
      data: routes
    };
  }

  public async updatePicture(id: string, file: string) {
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
    console.log("Update Pic")
    console.log(file);
    route.picture = file;
    const res = await route.save();
    return { data: res }
  }

  public async create(userId: string, role: RoleEnum, dto: CreateRouteDto) {
    // @ts-ignore
    return this.routeRepository.save(this.routeRepository.create({ user_id: userId, role, ...dto }));
  }

  public async saveRoute(user: any, dto: SaveRouteDto) {
    const isExist = await this.saveRouteRepository.findOne({
      where: {
        user_id: user.sub,
        route_id: dto.route_id
      }
    });
    if (isExist) {
      return {
        "errors": [
          {
            message: "You've Already Saved this Route",
          }
        ]
      }
    }
    const data = {
      user_id: user.sub,
      route_id: dto.route_id,    
    }
    await this.saveRouteRepository.save(this.saveRouteRepository.create(data));
    return { message: "Route Saved Successfully" };
  }

  public async getSaveRoute(id: string) {

    const savedRoutes = await this.saveRouteRepository.createQueryBuilder('saved')
      .where('saved.user_id = :id', { id: id })
      .leftJoinAndMapOne('saved.route', Route, 'route', 'route.id = saved.route_id')
      .getMany()

    if (!savedRoutes) {
      return {
        "errors": [
          {
            message: "No Saved Routes exist",
          }
        ]
      }
    }
    var responseArray = [];
    savedRoutes.forEach(routes => {
      if (routes['route']) {
        responseArray.push(routes['route']);
      }
    })
    return { data: responseArray };
  }

  async deleteOneRoute(id: string) {
    await this.routeRepository.delete(id);
    return { message: "Route Deleted Successfully" };
  }
}
