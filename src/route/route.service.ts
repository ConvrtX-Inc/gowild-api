import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { DeepPartial } from 'src/common/types/deep-partial.type';
import { FindOptions } from 'src/common/types/find-options.type';
import { getRepository, Not, Repository, SimpleConsoleLogger } from 'typeorm';
import { Route, RouteStatusEnum } from './entities/route.entity';
import { CreateRouteDto } from './dto/create-route.dto';
import { RoleEnum } from '../roles/roles.enum';
import { UserEntity } from '../users/user.entity';
import { Status } from '../statuses/status.entity';
import { SaveRouteDto } from './dto/save-route-dto';
import { SavedRoute } from './entities/saved-routs.entity';
import { UpdateRouteDto } from './dto/update-route.dto';
import { LeaderBoard } from 'src/leader-board/entities/leader-board.entity';
import { StatusEnum } from 'src/auth/status.enum';
import { paginateResponse } from "../common/paginate.response";
import { RouteHistoricalEvent } from 'src/route-historical-events/entities/route-historical-event.entity';
import { NotificationTypeEnum } from "../notification/notification-type.enum";
import { NotificationService } from "../notification/notification.service";
import { SimpleUser } from 'src/auth/dtos/token';


@Injectable()
export class RouteService extends TypeOrmCrudService<Route> {
  constructor(
    @InjectRepository(LeaderBoard)
    private readonly leaderBoardRepository: Repository<LeaderBoard>,
    @InjectRepository(Route)
    private readonly routeRepository: Repository<Route>,
    @InjectRepository(SavedRoute)
    private readonly saveRouteRepository: Repository<SavedRoute>,
    @InjectRepository(RouteHistoricalEvent)
    private routeHistoricalEventRepository: Repository<RouteHistoricalEvent>,
    private readonly NotificationService: NotificationService,
  ) {
    super(routeRepository);
  }

  async findOneEntity(options: FindOptions<Route>) {
    const route = await this.routeRepository.findOne({
      where: options.where,
    });

    const user = await getRepository(UserEntity).findOne({ where: { id: route.user_id } });

    route['firstName'] = user.firstName
    route['lastName'] = user.lastName
    route['userPicture'] = user.picture
    return { route: route }
  }



  async findAndCountManyEntities(options: FindOptions<Route>, pageNo: number, limitNo: number) {
    const take = limitNo || 100;
    const page = pageNo || 1;
    const skip = (page - 1) * take;
    //const order = options.order ? options.order : undefined;

    const createdRoutes = await this.routeRepository.findAndCount({
      where: options.where,
      order: options.order,
      relations: options.relations,
      skip: skip,
      take: take,

    });
    return paginateResponse(createdRoutes, page, take)

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
    await this.routeRepository
      .createQueryBuilder()
      .update()
      .set(dto)
      .where('id = :id', { id })
      .execute();

    const route = await this.routeRepository.findOne({
      where: { id: id },
    });
    return {
      message: 'Route Updated Successfully',
      data: route,
    };
  }

  /*
   * Get All Admin Routes with leaderboard
   */

  public async getApprovedRoutes(
    id?: string,
    lat?: string,
    long?: string,
    pageNo?: number,
    limitNo?: number,
  ) {
    const page = pageNo || 1,
      limit = limitNo || 100;
    const [routes, total] = await this.routeRepository.findAndCount({
      where: { status: StatusEnum.Approved },
      relations: ['historicalEvents'],
      skip: (page - 1) * limit,
      take: limit,
      order:{
        createdDate: 'DESC'
      }
    });

    if (!routes) {
      return {
        error: [{ message: 'No routes found' }],
      };
    }

    const results = [];
    for (let i = 0; i < routes.length; i++) {
      const user = [];
      const leaderStats = await LeaderBoard.createQueryBuilder('leader')
        .where('leader.route_id = :id', { id: routes[i].id })
        .leftJoinAndMapOne(
          'leader.user',
          UserEntity,
          'user',
          'leader.user_id = user.id',
        )
        .orderBy('leader.completionTime', 'ASC')
        .limit(3)
        .getMany();

      const crrUser_leaderStat = await LeaderBoard.createQueryBuilder('l')
        .where('l.route_id = :id AND l.user_id = :user ', { id: routes[i].id, user: id })
        .leftJoinAndMapOne(
          'l.user',
          UserEntity,
          'user',
          'l.user_id = user.id',
        )
        .getOne();

      if (leaderStats) {
        leaderStats.forEach((state) => {
          const leaderboard = this.mapLeaderboard(
            state.id,
            state.user_id,
            state['user'].firstName,
            state['user'].picture,
            state.rank,
          );
          user.push(leaderboard);
        });
      }
      if (crrUser_leaderStat) {
        const crr_user_leaderboard = this.mapLeaderboard(
          crrUser_leaderStat.id,
          crrUser_leaderStat.user_id,
          crrUser_leaderStat['user'].firstName,
          crrUser_leaderStat['user'].picture,
          crrUser_leaderStat.rank,
        );
        routes[i]['crr_user_leaderboard'] = crr_user_leaderboard;
      } else {
        routes[i]['crr_user_leaderboard'] = null;
      }
      routes[i]['leaderboard'] = user;

      // Checking the Current is Saved by Logged-in User Or Not
      const saved = await SavedRoute.findOne({
        where: {
          user_id: id,
          route_id: routes[i].id
        }
      });
      if (saved) {
        routes[i]['saved'] = true;
      } else {
        routes[i]['saved'] = false;
      }
      if (
        this.closestLocation(
          parseFloat(lat),
          parseFloat(long),
          routes[i].start.latitude,
          routes[i].start.longitude,
          'K',
        ) >= 0
      ) {
        results.push(routes[i]);
      }
    }
    if (results.length === 0) {
      return {
        message: 'No routes found within 5km of the given latitude and longitude',
        data: [],
        count: 0,
        currentPage: 0,
        prevPage: null,
        totalPage: 0,
      };
    }

    const totalPage = Math.ceil(total / limit);
    const currentPage = parseInt(String(page));
    const prevPage = page > 1 ? page - 1 : null;
    return {
      message: 'Approved routes successfully fetched!',
      data: results,
      count: total,
      currentPage,
      prevPage,
      totalPage,
    };
  }

  /*
  get all admin routes only
  */
  public async getAllAdminRoutes() {
    const routes = await this.routeRepository.find({
      where: { role: Not(RoleEnum.USER) },
      relations: ['historicalEvents'],
      order: { createdDate: 'DESC' },
    });

    if (!routes) {
      return {
        error: [{ message: 'No routes found' }],
      };
    }
    return {
      message: 'Admin Routes fetched Successfully!',
      data: routes,
    };
  }

  /*
  Map Leader Board
  */
  mapLeaderboard(
    id: string,
    user_id: string,
    firstName: string,
    picture: string,
    rank: number
  ) {
    const leaderboard: {
      id: string;
      user_id: string;
      name: string;
      image: string;
      rank: number
    } = {
      id: id,
      user_id: user_id,
      name: firstName,
      image: picture,
      rank: rank
    };
    return leaderboard;
  }

  /*
  Get Distance b/w Latitude and Longitude
  */
  closestLocation(lat1, lon1, lat2, lon2, unit) {
    const R = 6371e3; // metres
    const φ1 = (lat1 * Math.PI) / 180; // φ, λ in radians
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // in metres
    const km = Math.round(d / 1000);
    console.log(km);
    return km;
  }

  public async getUserRoutes() {
    const routes = await this.routeRepository
      .createQueryBuilder('route')
      .where('route.role =:role', { role: RoleEnum.USER })
      .leftJoinAndMapOne(
        'route.user',
        UserEntity,
        'user',
        'user.id = route.user_id',
      )
      .leftJoinAndMapOne(
        'user.status',
        Status,
        'status',
        'status.id = user.status_id',
      )
      .orderBy('route.createdDate', 'DESC')
      .getMany();

    if (!routes) {
      return {
        error: [{ message: 'No routes found' }],
      };
    }
    return {
      message: 'User routes successfully fetched!',
      data: routes,
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
    console.log('Update Pic');
    console.log(file);
    route.picture = file;
    const res = await route.save();
    return { message: 'Route Created Successfully!', data: res };
  }

  public async create(userId: string, role: RoleEnum, dto: CreateRouteDto, user?: SimpleUser) {
    // @ts-ignore    
    if (role === RoleEnum.ADMIN || role === RoleEnum.SUPER_ADMIN) {
      const newRoute = await this.routeRepository.save(
        this.routeRepository.create({
          user_id: userId,
          status: RouteStatusEnum.Approved,
          role,
          ...dto,
        }),
      );

      if (dto.historical_route) {
        var resArr = [];
        for (let i = 0; i < dto.historical_route.length; i++) {
          let myhistorical = {};
          myhistorical = dto.historical_route[i];
          myhistorical['route_id'] = newRoute.id;
          const newHistorical = await this.routeHistoricalEventRepository.save(
            this.routeHistoricalEventRepository.create(myhistorical),
          );
          console.log(newHistorical);
          resArr.push(newHistorical)
        }
      }
      newRoute['historical_route'] = resArr;
      return newRoute;
    } else {
      const data = await this.routeRepository.save(
        this.routeRepository.create({
          user_id: userId,
          status: RouteStatusEnum.Pending,
          role,
          ...dto,
        }),
      );
      await this.NotificationService.createNotificationAdmin(`${user.firstName} ${user.lastName} created a route "${data.title}"`, NotificationTypeEnum.ROUTES);
      return { message: 'Route Created Successfully!', data: data }
    }
  }

  public async saveRoute(user: any, dto: SaveRouteDto) {
    const isExist = await this.saveRouteRepository.findOne({
      where: {
        user_id: user.sub,
        route_id: dto.route_id,
      },
    });
    if (isExist) {
      const deleteRoute = await this.saveRouteRepository.delete(isExist.id);
      console.log(deleteRoute);
      return { message: 'Route unsaved Successfully', data: false };
    }
    const data = {
      user_id: user.sub,
      route_id: dto.route_id,
    };
    await this.saveRouteRepository.save(this.saveRouteRepository.create(data));
    return { message: 'Route Saved Successfully', data: true };
  }

  public async getSaveRoute(id: string, pageNo: number, limitNo: number) {
    const page = pageNo || 1,
      limit = limitNo || 100,
      skip = (page - 1) * limit;

    const [savedRoutes, total] = await this.saveRouteRepository
      .createQueryBuilder('saved')
      .where('saved.user_id = :id', { id: id })
      .leftJoinAndMapOne(
        'saved.route',
        Route,
        'route',
        'route.id = saved.route_id',
      ).leftJoinAndMapMany(
        'route.historicalEvents',
        RouteHistoricalEvent,
        'historicalEvents',
        'historicalEvents.route_id = route.id'
      )
      .skip(skip)
      .take(limit)
      .orderBy('saved.createdDate', 'DESC')
      .getManyAndCount();

    if (!savedRoutes) {
      return {
        errors: [
          {
            message: 'No Saved Routes exist',
          },
        ],
      };
    }

    const results = [];
    for (let i = 0; i < savedRoutes.length; i++) {
      const user = [];
      const leaderStats = await LeaderBoard.createQueryBuilder('leader')
        .where('leader.route_id = :id ', { id: savedRoutes[i].route_id })
        .leftJoinAndMapOne(
          'leader.user',
          UserEntity,
          'user',
          'leader.user_id = user.id',
        )
        .orderBy('leader.rank', 'ASC')
        .limit(3)
        .getMany();

      const currentUser = await LeaderBoard.createQueryBuilder('leader')
        .where('leader.route_id = :id ', { id: savedRoutes[i].route_id })
        .andWhere('leader.user_id = :userId', { userId: id })
        .leftJoinAndMapOne(
          'leader.user',
          UserEntity,
          'user',
          'leader.user_id = user.id',
        )
        .getOne();

      if (leaderStats) {
        leaderStats.forEach((state) => {
          const leaderboard = this.mapLeaderboard(
            state.id,
            state.user_id,
            state['user'].firstName,
            state['user'].picture,
            state.rank,
          );
          user.push(leaderboard);
        });
      }
      if (currentUser) {
        const currentUserData = this.mapLeaderboard(
          currentUser.id,
          currentUser.user_id,
          currentUser['user'].firstName,
          currentUser['user'].picture,
          currentUser.rank,
        );
        savedRoutes[i]['currentUser'] = currentUserData;
      } else {
        savedRoutes[i]['currentUser'] = null;
      }
      savedRoutes[i]['leaderboard'] = user;
      results.push(savedRoutes[i]);
    }
    const totalPage = Math.ceil(total / limit);
    const currentPage = parseInt(String(page));
    const prevPage = page > 1 ? page - 1 : null;
    return {
      message: 'Saved routes successfully fetched!',
      data: results,
      count: total,
      currentPage,
      prevPage,
      totalPage,
    };
  }

  async deleteOneRoute(id: string) {
    await this.routeRepository.delete(id);
    return { message: 'Route Deleted Successfully' };
  }

  async updateApprovedStatus(id) {
    const status = await this.routeRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!status) {
      throw new NotFoundException({
        errors: [{ message: 'Route not Found!' }],
      });
    }
    status.status = RouteStatusEnum.Approved;
    await status.save();
    await this.NotificationService.createNotification(
      status.user_id,
      `${status.title} Route approved Successfully!`, NotificationTypeEnum.APPROVE
    );

    return {
      message: 'Status Changed Successfully (Route Approved!)!',
    };
  }

  async updateRejectStatus(id) {
    const status = await this.routeRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!status) {
      throw new NotFoundException({
        errors: [{ message: 'Route not Found!' }],
      });
    }
    status.status = RouteStatusEnum.Reject;
    await status.save();
    return {
      message: 'Status Changed Successfully (Route Rejected!)',
    };
  }

  /*
   * Find One Admin Route 
   */
  async findOneRoute(id: string) {
    const route = await this.routeRepository.findOne({
      where: {
        id: id
      }
    })
    const historical = await this.routeHistoricalEventRepository.find({
      where: {
        route_id: id
      }
    })
    const user = await getRepository(UserEntity).findOne({ where: { id: route.user_id } });
    route['firstName'] = user.firstName
    route['lastName'] = user.lastName
    route['userPicture'] = user.picture   
    if (historical) {      
      route['historical_event'] = historical
    } else {
      route['historical_event'] = []
    }
    return route;
  }


  async getOneRoute(routeId){
    const route = await this.routeRepository.findOne({
      where:{
        id: routeId
      },
      relations: ['historicalEvents']
      

    });
    return {data : route}
  }
}
