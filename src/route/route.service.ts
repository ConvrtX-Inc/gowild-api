import {HttpStatus, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {TypeOrmCrudService} from '@nestjsx/crud-typeorm';
import {DeepPartial} from 'src/common/types/deep-partial.type';
import {FindOptions} from 'src/common/types/find-options.type';
import {Repository} from 'typeorm';
import {Route} from './entities/route.entity';
import {FilesService} from '../files/files.service';
import {CreateRouteDto} from "./dto/create-route.dto";
import {RoleEnum} from "../roles/roles.enum";
import {FileEntity} from "../files/file.entity";

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

  // To Get Many Routes with user_id and saved = true/false 
  async getManyRoute(id:string, saved:any){
    console.log(typeof(saved));
    if(saved == "true"){
      const saved = await this.routeRepository.find({
        user_id: id,
        saved: true
      })
      return saved;

    }else if ( saved == "false"){

      const notSaved = await this.routeRepository.find({
        user_id: id,
        saved: false
      })
      return notSaved;
    }else{
      const allRoutes = await this.routeRepository.find({
        user_id: id
      });
      return allRoutes      
    }
  }

  // Get All Admin Routes 
  public async getAdminRoutes(){
    const routes = await this.routeRepository.find({
      role: RoleEnum.ADMIN
    })
    if(!routes){
      return{
        error : [{ message : "Something went wrong!"}]
      };
    }
    return {

          message : "Admin routes successfully fetched!",
          data: routes
    };
  }

  public async updatePicture(id: string, file: FileEntity) {
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

    route.picture = file;
    return await route.save();
  }

  public async create(userId: string, role: RoleEnum, dto: CreateRouteDto) {
    // @ts-ignore
    return this.routeRepository.save(this.routeRepository.create({user_id: userId, role, ...dto}));
  }
}
