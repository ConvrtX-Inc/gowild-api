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

@Injectable()
export class LeaderBoardService extends TypeOrmCrudService<LeaderBoard> {
  constructor(
    @InjectRepository(LeaderBoard)
    private Repository: Repository<LeaderBoard>,
  ) {
    super(Repository);
  }

  async create(userId: string, createPostFeedDto: CreateLeaderBoardDto) {
    const data = await this.Repository.create({ user_id: userId, ...createPostFeedDto });
    await this.Repository.save(data);

    if (!data) {
      return {
        "errors": [
          {
            message: "Could not create Post-Feed!",
            status: HttpStatus.BAD_REQUEST,
          }
        ]
      }
    }
    
    return { message: "Created successfully!", data: data };
  }

  async getRankings(pageNo: number){
    const take = 10
    const page = pageNo || 1;
    const skip = (page - 1) * take;

    const data = await this.Repository.createQueryBuilder('leaderBoard')
    .leftJoinAndMapOne('leaderBoard.user', UserEntity, 'user', 'user.id = user_id')
    .orderBy('leaderBoard.createdDate', 'ASC')
    .skip(skip).take(take)
    .getManyAndCount();




    return paginateResponse(data, page, take);
  }

  

}
