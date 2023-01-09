import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LeaderBoardService } from './leader-board.service';
import { CreateLeaderBoardDto } from './dto/create-leader-board.dto';
import { UpdateLeaderBoardDto } from './dto/update-leader-board.dto';

@Controller('leader-board')
export class LeaderBoardController {
  constructor(private readonly leaderBoardService: LeaderBoardService) {}

  @Post()
  create(@Body() createLeaderBoardDto: CreateLeaderBoardDto) {
    return this.leaderBoardService.create(createLeaderBoardDto);
  }

  @Get()
  findAll() {
    return this.leaderBoardService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.leaderBoardService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLeaderBoardDto: UpdateLeaderBoardDto) {
    return this.leaderBoardService.update(+id, updateLeaderBoardDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.leaderBoardService.remove(+id);
  }
}
