import {
  Body,
  Request,
  Controller,
  UseGuards,
  Get,
  Param,
  Post,
  HttpCode,
  HttpStatus,
  UseInterceptors, UploadedFile
} from '@nestjs/common';
import { TicketService } from './ticket.service';
import {ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags} from '@nestjs/swagger';
import {Crud, CrudController, Override} from '@nestjsx/crud';
import { Ticket } from './entities/ticket.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {CreateTicketDto} from "./dto/create-ticket.dto";
import {FileInterceptor} from "@nestjs/platform-express";
import {FilesService} from "../files/files.service";
import {ConfigService} from "@nestjs/config";
import {Card} from "../cards/entities/card.entity";

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Ticket')
@Crud({
  model: {
    type: Ticket,
  },
  routes: {
    exclude: ['replaceOneBase', 'createManyBase'],
  },
  query: {
    maxLimit: 50,
    alwaysPaginate: true,
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
  path: 'ticket',
  version: '1',
})
export class TicketController implements CrudController<Ticket> {
  constructor(readonly service: TicketService,
              private readonly filesService: FilesService,
              private readonly configService: ConfigService) {}

  get base(): CrudController<Ticket> {
    return this;
  }

  @Override('createOneBase')
  async createOneTicket(@Request() req ,@Body() dto: CreateTicketDto){
    return await this.service.createTicket(dto, req.user.sub)
  }


  @Override('getOneBase')
  async getOneTicket(@Param('id') id: string) {
    return this.service.getTicket(id);
  }

  @Get('users/:user_id')
  @ApiOperation({summary: "Retrieve all tickets by user ID"})
  public async getComments(@Param('user_id') userId: string) {
    return this.service.getTicketsByUserId(userId);
  }



  @ApiResponse({ type: Ticket })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @Post(':id/update-image')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('file'))
  public async updateImage(
      @Param('id') id: string,
      @UploadedFile() file: Express.Multer.File,
  ) {
    const driver = this.configService.get('file.driver');
    const picture =  {
      local: `/${this.configService.get('app.apiPrefix')}/v1/${file.path}`,
      s3: file.location,
      firebase: file.publicUrl,
    };
    return this.service.updateTicketPicture(id, picture[driver] );
  }
}
