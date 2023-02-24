import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Body,
  Request,
  Get,
  Query,
} from '@nestjs/common';
import { Crud, CrudController, Override } from '@nestjsx/crud';
import { TreasureChest } from './entities/treasure-chest.entity';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateTreasureChestDto } from './dto/create-treasure-chest.dto';
import { RegisterTreasureHuntDto } from './dto/register-treasure-hunt.dto';
import { TreasureWildService } from './treasure-wild.service';
import { verifyHuntDto } from './dto/change-hunt-status';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Treasure Wild')
@Crud({
  model: {
    type: TreasureChest,
  },
  routes: {
    exclude: [
      'replaceOneBase',
      'createManyBase',
      'createOneBase',
      'deleteOneBase',
      'createOneBase',
      'updateOneBase',
    ],
  },
  dto: {
    create: CreateTreasureChestDto,
  },
  query: {
    maxLimit: 50,
    alwaysPaginate: true,
    join: {
      picture: {
        eager: true,
        exclude: ['createdDate', 'updatedDate'],
      },
    },
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
  path: '/treasure-wild',
  version: '1',
})
export class TreasureWildController implements CrudController<TreasureChest> {
  constructor(readonly service: TreasureWildService) {}

  get base(): CrudController<TreasureChest> {
    return this;
  }

  @Override('createOneBase')
  @Post('register')
  @HttpCode(HttpStatus.OK)
  async registerTreasureHunt(
    @Body() dto: RegisterTreasureHuntDto,
    @Request() request,
  ) {
    return await this.service.registerTreasureHunt(dto, request.user.sub);
  }

  @ApiResponse({ type: TreasureChest })
  @Get('listings')
  @ApiOperation({ summary: 'Get All listings' })
  @HttpCode(HttpStatus.OK)
  async getAllListings(@Query() query, @Request() req) {
    return await this.service.getTreasureWild(query.limit, query.page, req.user.sub);
  }
  @Post('verify')
  @HttpCode(HttpStatus.OK)
  async veriifyHunt(@Body() dto: verifyHuntDto, @Request() req) {
    return await this.service.verifyHunt(dto, req.user);
  }

  @Post('resend-code')
  @HttpCode(HttpStatus.OK)
  async resendCode(@Body() dto: RegisterTreasureHuntDto, @Request() req) {
    return await this.service.resendCode(dto, req.user.sub);
  }
}
