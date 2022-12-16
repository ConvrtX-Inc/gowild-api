import { Controller, HttpCode, HttpStatus, Param, Post, UseGuards, Body, Request  } from '@nestjs/common';
import { TreasureChestService } from './treasure-chest.service';
import { Crud, CrudController, Override } from '@nestjsx/crud';
import { TreasureChest } from './entities/treasure-chest.entity';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminRolesGuard } from "../roles/admin.roles.guard";
import { CreateTreasureChestDto } from "./dto/create-treasure-chest.dto";
import { RegisterTreasureHuntDto } from './dto/register-treasure-hunt.dto';
import { TreasureWildService } from './treasure-wild.service';


@ApiBearerAuth()
@UseGuards(JwtAuthGuard, AdminRolesGuard)
@ApiTags('Treasure Wild')
@Crud({
    model: {
        type: TreasureChest,
    },
    routes: {
        exclude: ['replaceOneBase', 'createManyBase', 'createOneBase', 'deleteOneBase', 'createOneBase', 'updateOneBase'],
    },
    dto: {
        create: CreateTreasureChestDto
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
    constructor(readonly service: TreasureWildService) { }

    get base(): CrudController<TreasureChest> {
        return this;
    }

    @Override('createOneBase')

    @Post('register')
    @HttpCode(HttpStatus.OK)
    async registerTreasureHunt(@Body() dto : RegisterTreasureHuntDto, @Request() request ) {
        return this.service.registerTreasureHunt(dto , request)
    }

}
