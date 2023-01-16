import { Injectable } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { paginateResponse } from 'src/common/paginate.response';
import databaseConfig from 'src/config/database.config';
import { UserEntity } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { CreateLeaderBoardDto } from './dto/create-leader-board.dto';
import { UpdateLeaderBoardDto } from './dto/update-leader-board.dto';
import { LeaderBoard } from './entities/leader-board.entity';
import * as moment from 'moment';

@Injectable()
export class LeaderBoardService extends TypeOrmCrudService<LeaderBoard> {
  constructor(
    @InjectRepository(LeaderBoard)
    private Repository: Repository<LeaderBoard>,
  ) {
    super(Repository);
  }

//   async create(userId: string, dto: CreateLeaderBoardDto) {
//     const completionTime = moment.utc(moment(dto.endDate).diff(moment(dto.startDate))).format("HH:mm:ss");
//     const record = new LeaderBoard();
//     record.user_id = userId,
//     record.route_id = dto.route_id,
//     record.completionTime = completionTime
//     record.startDate = dto.startDate
//     record.endDate = dto.endDate


//     const result = await this.Repository.findOne({
//       where:{
//         user_id: userId,
//         route_id: dto.route_id
//       }
//     });

//   if(!result){
//     const data = await this.Repository.create(record);
//     await this.Repository.save(data);
//     return { message: "Created successfully!", data: data };
//   }

//   await this.Repository.update(result.id, record)
//   const updatedResult = await this.Repository.findOne({
//     where:{
//       id: result.id
//     }
//   });
//   return { message: "Updated successfully!", data: updatedResult };
    
// }

  // async updateLeaderBoard(userId:string, dto: CreateLeaderBoardDto){
  //   console.log(dto);
  //   await this.Repository.createQueryBuilder()
  //   .update().set(dto).where('user_id = :userId', {userId: userId}).andWhere('route_id = :routeId', {routeId: dto.route_id})
  //   .execute()

  //   const data = await this.Repository.findOne({
  //     where:{
  //       route_id: dto.route_id,
  //       user_id: userId
  //     }
  //   })

  //   return{
  //     message: "Updated Successfully...",
  //     data: data
      
  //   }

  // }

  async create(userId: string, dto: CreateLeaderBoardDto) {
    const completionTime = moment.utc(moment(dto.endDate).diff(moment(dto.startDate))).format("HH:mm:ss");
    const record = new LeaderBoard();
    record.user_id = userId,
    record.route_id = dto.route_id,
    record.completionTime = completionTime
    record.startDate = dto.startDate
    record.endDate = dto.endDate
  
    const result = await this.Repository.findOne({ user_id: userId, route_id: dto.route_id });

    if(result && completionTime >= result.completionTime){
      return { message: "Try again!", completionTime: completionTime};
    }
  
    if(!result){
      const data = await this.Repository.save(record);
      return { message: "Created successfully!", data };
    }
  
    await this.Repository.update({ id: result.id }, record);
    const updatedResult = await this.Repository.findOne({ id: result.id });
    return { message: "Updated successfully!", data: updatedResult };
  }
  
  

  async getRankings(pageNo: number){
    const take = 10
    const page = pageNo || 1;
    const skip = (page - 1) * take;

    const data = await this.Repository.createQueryBuilder('leaderBoard')
    .leftJoinAndMapOne('leaderBoard.user', UserEntity, 'user', 'user.id = user_id')
    .orderBy('leaderBoard.completionTime', 'ASC')
    .skip(skip).take(take)
    .getManyAndCount();




    return paginateResponse(data, page, take);
  }

  // Get by Route Id
  async rankByRoute(routeId: string, pageNo: number){
    const take = 10
    const page = pageNo || 1;
    const skip = (page - 1) * take;
    
    const data = await this.Repository.createQueryBuilder('leaderBoard')
    .leftJoinAndMapOne('leaderBoard.user', UserEntity, 'user')
    .where('user.id = user_id')
    .andWhere('leaderBoard.route_id = :routeId', {routeId: routeId})
    .orderBy('leaderBoard.completionTime', 'ASC')
    .skip(skip).take(take)
    .getManyAndCount();

    return paginateResponse(data, page, take);

  }

  // async getPosition(userId: string) {
  //   const data = await this.Repository.createQueryBuilder('leaderBoard')
  //   // .where('leaderBoard.route_id = :routeId', {routeId: routeId})
  //   .andWhere('leaderBoard.user_id = :userId', {userId: userId})
  //   .orderBy('leaderBoard.completionTime', 'ASC')
  //   .getMany();

  //   if (data.length > 0) {
  //     let positions = {}
  //     data.forEach(leaderboard => {
  //         if (!positions[leaderboard.route_id]) {
  //             positions[leaderboard.route_id] = data.filter(d => d.route_id === leaderboard.route_id)
  //             .map(row => row.user_id).indexOf(userId) + 1;
  //         }
  //     });
  //     return {message: "success", positions};
  // }
  // // return {};

  //   // return data;
  // }



  async getPosition(userId: string) {
    const data = await this.Repository.createQueryBuilder('leaderBoard')
      .where('leaderBoard.user_id = :userId', { userId })
      .orderBy('leaderBoard.completionTime', 'ASC')
      .getRawMany();
  
  
  }

  
  
  
  

}
