import { Injectable } from '@nestjs/common';
import { CreateLeaderBoardDto } from './dto/create-leader-board.dto';
import { UpdateLeaderBoardDto } from './dto/update-leader-board.dto';

@Injectable()
export class LeaderBoardService {
  create(createLeaderBoardDto: CreateLeaderBoardDto) {
    return 'This action adds a new leaderBoard';
  }

  findAll() {
    return `This action returns all leaderBoard`;
  }

  findOne(id: number) {
    return `This action returns a #${id} leaderBoard`;
  }

  update(id: number, updateLeaderBoardDto: UpdateLeaderBoardDto) {
    return `This action updates a #${id} leaderBoard`;
  }

  remove(id: number) {
    return `This action removes a #${id} leaderBoard`;
  }
}
