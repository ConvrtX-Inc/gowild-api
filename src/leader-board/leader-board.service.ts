import { Injectable } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { paginateResponse } from 'src/common/paginate.response';
import databaseConfig from 'src/config/database.config';
import { UserEntity } from 'src/users/user.entity';
import { LessThan, LessThanOrEqual, MoreThan, Repository } from 'typeorm';
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


  async createLeaderBoard(userId: string, dto: CreateLeaderBoardDto) {
    const completionTime = moment.utc(moment(dto.endDate).diff(moment(dto.startDate))).format("HH:mm:ss");

    const record = new LeaderBoard();
    record.user_id = userId;
    record.route_id = dto.route_id;
    record.completionTime = completionTime;
    record.startDate = dto.startDate;
    record.endDate = dto.endDate;

    const bestUserRecord = await this.Repository.findOne({ user_id: userId, route_id: dto.route_id, completionTime: LessThanOrEqual(completionTime) })

    if (bestUserRecord) return { message: "Previous try was better!", data: bestUserRecord };

    const lowerUserRecord = await this.Repository.findOne({ user_id: userId, route_id: dto.route_id, completionTime: MoreThan(completionTime) })



    if (lowerUserRecord) return this.updateRecentRank(lowerUserRecord, completionTime, dto);




    const existingRecord = await this.Repository.findOne({ route_id: dto.route_id, completionTime: completionTime });

    if (existingRecord) {
      record.rank = existingRecord.rank;
    } else {
      const upperRanks = await this.Repository.createQueryBuilder("leaderBoard")
        .where("leaderBoard.route_id = :route_id", { route_id: dto.route_id })
        .andWhere("leaderBoard.completionTime >= :completionTime", { completionTime: completionTime })
        .orderBy("leaderBoard.rank", "ASC")
        .getMany();

      if (upperRanks.length === 0) {
        const lowerRanks = await this.Repository.createQueryBuilder("leaderBoard")
          .where("leaderBoard.route_id = :route_id", { route_id: dto.route_id })
          .andWhere("leaderBoard.completionTime < :completionTime", { completionTime: completionTime })
          .orderBy("leaderBoard.rank", "DESC")
          .take(1)
          .getMany();
        if (lowerRanks.length === 0) {

          record.rank = 1
          return this.leaderBoardResponse(record);

        }

        record.rank = lowerRanks[0].rank + 1;
      } else {
        record.rank = upperRanks[0].rank;
        await this.Repository.createQueryBuilder()
          .update(LeaderBoard)
          .set({ rank: () => "rank + 1" })
          .where("route_id = :id and rank >= :rank", { id: dto.route_id, rank: record.rank })
          .execute();
      }
    }

    return this.leaderBoardResponse(record);

  }

  /* Get Rankings */
  async getRankings(pageNo: number) {
    const take = 10
    const page = pageNo || 1;
    const skip = (page - 1) * take;

    const data = await this.Repository.createQueryBuilder('leaderBoard')
      .leftJoinAndMapOne('leaderBoard.user', UserEntity, 'user', 'user.id = user_id')
      .orderBy('leaderBoard.rank', 'ASC')
      .skip(skip).take(take)
      .getManyAndCount();




    return paginateResponse(data, page, take);
  }

  // Get by Route Id 'main leader board listings'
  async rankByRoute(routeId: string, pageNo: number) {
    const take = 10
    const page = pageNo || 1;
    const skip = (page - 1) * take;

    const data = await this.Repository.createQueryBuilder('leaderBoard')
      .leftJoinAndMapOne('leaderBoard.user', UserEntity, 'user')
      .where('user.id = user_id')
      .andWhere('leaderBoard.route_id = :routeId', { routeId: routeId })
      .orderBy('leaderBoard.rank', 'ASC')
      .skip(skip).take(take)
      .getManyAndCount();

    return paginateResponse(data, page, take);

  }





  async getPosition(userId: string) {
    const data = await this.Repository.createQueryBuilder('leaderBoard')
      .where('leaderBoard.user_id = :userId', { userId })
      .orderBy('leaderBoard.completionTime', 'ASC')
      .getRawMany();



  }


  private async updateRecentRank(lowerUserRecord, completionTime, dto) {

    lowerUserRecord.completionTime = completionTime;
    lowerUserRecord.startDate = dto.startDate;
    lowerUserRecord.endDate = dto.endDate;

    //Calculate new rank of the updated record
    const upperRanks = await this.Repository.createQueryBuilder("leaderBoard")
      .where("leaderBoard.route_id = :route_id", { route_id: dto.route_id })
      .andWhere("leaderBoard.completionTime > :completionTime", { completionTime: completionTime })
      .orderBy("leaderBoard.rank", "ASC")
      .take(1)
      .getMany();

    const lowerRanks = await this.Repository.createQueryBuilder("leaderBoard")
      .where("leaderBoard.route_id = :route_id", { route_id: dto.route_id })
      .andWhere("leaderBoard.completionTime <= :completionTime", { completionTime: completionTime })
      .orderBy("leaderBoard.rank", 'DESC')
      .take(1)
      .getMany();

    if (upperRanks.length === 0) {
      const lowerRanks = await this.Repository.createQueryBuilder("leaderBoard")
        .where("leaderBoard.route_id = :route_id", { route_id: dto.route_id })
        .andWhere("leaderBoard.completionTime < :completionTime", { completionTime: completionTime })
        .orderBy("leaderBoard.rank", "DESC")
        .take(1)
        .getMany();
      if (lowerRanks.length === 0) {

        lowerUserRecord.rank = 1
        const data = await this.Repository.save(lowerUserRecord);
        return { message: "Updated successfully!", data: data };

      }

      lowerUserRecord.rank = lowerRanks[0].rank + 1;
    } else {
      if (upperRanks[0].rank === 1) {
        lowerUserRecord.rank = upperRanks[0].rank;
        await this.Repository.createQueryBuilder()
          .update(LeaderBoard)
          .set({ rank: () => "rank + 1" })
          .where("route_id = :id and completionTime > :completionTime", { id: dto.route_id, completionTime: completionTime })
          .execute();

        return this.leaderBoardResponse(lowerUserRecord);

      }

      if (lowerRanks[0].completionTime === completionTime) {

        lowerUserRecord.rank = lowerRanks[0].rank
        await this.Repository.createQueryBuilder()
          .update(LeaderBoard)
          .set({ rank: () => "rank - 1" })
          .where("route_id = :id and completionTime > :completionTime", { id: dto.route_id, completionTime: completionTime })
          .execute();

        return this.leaderBoardResponse(lowerUserRecord);

      }

      lowerUserRecord.rank = upperRanks[0].rank - 1;
      await this.Repository.createQueryBuilder()
        .update(LeaderBoard)
        .set({ rank: () => "rank + 1" })
        .where("route_id = :id and completionTime > :completionTime", { id: dto.route_id, completionTime: completionTime })
        .execute();

      return this.leaderBoardResponse(lowerUserRecord);
    }
  }

  private async leaderBoardResponse(record) {
    const data = await this.Repository.save(record);
    return { message: "Success!", data: data };
  }

}
