import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import {TicketService} from './ticket.service';
import {ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags} from '@nestjs/swagger';
import {Crud, CrudController, Override} from '@nestjsx/crud';
import {Ticket} from './entities/ticket.entity';
import {JwtAuthGuard} from '../auth/jwt-auth.guard';
import {CreateTicketDto} from "./dto/create-ticket.dto";
import {FileInterceptor} from "@nestjs/platform-express";
import {FilesService} from "../files/files.service";
import {ConfigService} from "@nestjs/config";
import {Roles} from "../roles/roles.decorator";
import {RolesGuard} from "../roles/roles.guard";
import {RoleEnum} from "../roles/roles.enum";

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
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

  @Override('getManyBase')
  @Roles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN)
  @ApiOperation({summary: "Retrieve all tickets"})
  async getManyTickets(){
    return{
      message: 'Tickets fetched Successfully!',
      data: await this.service.getAllTickets()
    }
  }

  @Get('users/:user_id')
  @ApiOperation({summary: "Retrieve all tickets by user ID"})
  public async getTicketsUserId(@Param('user_id') userId: string) {
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
  // design api for updating status from pending to completed

  @Post(':id/status')
  @ApiOperation({summary: "Change Status from PENDING to COMPLETED"})
  async ticketStatus(@Param('id') id:string){
    return this.service.updateStatus(id);
  }


}
