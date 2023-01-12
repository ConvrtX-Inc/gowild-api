import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { LeaderBoardService } from './leader-board.service';
import { CreateLeaderBoardDto } from './dto/create-leader-board.dto';
import { UpdateLeaderBoardDto } from './dto/update-leader-board.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Crud, CrudController } from '@nestjsx/crud';
import { LeaderBoard } from './entities/leader-board.entity';
import { Query } from '@nestjs/common/decorators';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';


@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Leaderboard')
@Crud({
  model: {
    type: LeaderBoard,
  },
  routes: {
    exclude: ['replaceOneBase', 'createManyBase'],
  },
  query: {
    maxLimit: 50,
    alwaysPaginate: true,
  },
  dto: {
    create: CreateLeaderBoardDto,
    update: UpdateLeaderBoardDto
  },
  params: {
    id: {
      type: 'uuid',
      primary: true,
      field: 'id',
    },
  },
})
@Controller({
  path: 'leaderboard',
  version: '1',
})
export class LeaderBoardController implements CrudController<LeaderBoard> {
  constructor(private readonly leaderBoardService: LeaderBoardService) { }

  get base(): CrudController<LeaderBoard> {
    return this;
  }
  service: LeaderBoardService = this.leaderBoardService;


  @ApiOperation({ summary: 'Create Record' })
  @Post()
  public async create(@Request() req: Express.Request, @Body() dto:CreateLeaderBoardDto){
    return this.service.create(req.user.sub, dto)

  }
  
  @ApiOperation({ summary: 'Get Rankings' })
  @Get()
  public async getAllRankings(@Query() query){
    return this.service.getRankings(query.page)
  }

  @ApiOperation({ summary: 'Get Rankings By route id' })
  @Get('/:route_id')
  public async getByRoute(@Param('route_id') routeId,@Query() query){
    return this.service.rankByRoute(routeId,query.page)
  }

}
