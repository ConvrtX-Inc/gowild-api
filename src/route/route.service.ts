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
import { UpdateRouteDto } from './dto/update-route.dto';
import { LeaderBoard } from 'src/leader-board/entities/leader-board.entity';

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

  async updateOneRoute(id: string, dto: UpdateRouteDto) {
    await this.routeRepository.createQueryBuilder()
      .update().set(dto).where('id = :id', { id }).execute()

    const route = await this.routeRepository.findOne({
      where: { id: id }
    });
    return {
      message: "Route Updated Successfully",
      route: route

    }
  }


  /* 
   * Get All Admin Routes
   */
  public async getAdminRoutes(id?: string, lat?: string, long?: string) {
    const routes = await this.routeRepository.find({
      role: Not(RoleEnum.USER)
    })
    if (!routes) {
      return {
        error: [{ message: "No routes found" }]
      };
    }

    var results = [];
    for (let i = 0; i < routes.length; i++) {

      const user = []
      const leaderStats = await LeaderBoard.createQueryBuilder('leader')
        .where('leader.route_id = :id AND leader.user_id != :user ', { id: routes[i].id, user: id })
        .leftJoinAndMapOne('leader.user', UserEntity, 'user', 'leader.user_id = user.id')
        .orderBy('leader.completionTime', 'ASC')
        .limit(4)
        .getMany();
      if (leaderStats) {

        leaderStats.forEach(state => {
          const leaderboard = this.mapLeaderboard(state.id, state.user_id, state['user'].firstName, state['user'].picture)
          user.push(leaderboard);
        })
      }
      routes[i]['leaderboard'] = user;

      const current_user_leaderboard = await LeaderBoard.createQueryBuilder('leader')
        .where('leader.route_id = :id AND leader.user_id = :user ', { id: routes[i].id, user: id })
        .leftJoinAndMapOne('leader.user', UserEntity, 'user', 'leader.user_id = user.id')
        .orderBy('leader.completionTime', 'ASC')
        .getMany();
      if (
        this.closestLocation(
          parseFloat(lat),
          parseFloat(long),
          routes[i].start.latitude,
          routes[i].start.longitude,
          'K',
        ) <= 5
      ) {
        results.push(routes[i]);
      }
    }

    return {
      message: "Admin routes successfully fetched!",
      data: results
    };
  }

  /*
  Map Leader Board
  */
  mapLeaderboard(id: string, user_id: string, firstName: string, picture: string) {
    let leaderboard: {
      id: string,
      user_id: string,
      name: string,
      image: string
    } = {
      id: id,
      user_id: user_id,
      name: firstName,
      image: picture,
    }
    return leaderboard;
  }

  /*
  Get Distance b/w Latitude and Longitude
  */
  closestLocation(lat1, lon1, lat2, lon2, unit) {
    const R = 6371e3; // metres
    const φ1 = lat1 * Math.PI / 180; // φ, λ in radians
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) *
      Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // in metres
    const km = Math.round(d / 1000);
    console.log(km);
    return km;
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
