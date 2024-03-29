import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Request,
  UseGuards,
  UseInterceptors,
  UploadedFiles, Query,
} from '@nestjs/common';
import { TicketService } from './ticket.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Crud, CrudController, Override } from '@nestjsx/crud';
import { Ticket } from './entities/ticket.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { FilesService } from '../files/files.service';
import { ConfigService } from '@nestjs/config';
import { Roles } from '../roles/roles.decorator';
import { RolesGuard } from '../roles/roles.guard';
import { RoleEnum } from '../roles/roles.enum';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { AddMessageidTicketDto } from './dto/add-messageid-ticket.dto';

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
  constructor(
    readonly service: TicketService,
    private readonly filesService: FilesService,
    private readonly configService: ConfigService,
  ) {}

  get base(): CrudController<Ticket> {
    return this;
  }

  @Override('createOneBase')
  async createOneTicket(@Request() req, @Body() dto: CreateTicketDto) {
    return await this.service.createTicket(dto, req.user.sub);
  }

  @Override('getOneBase')
  async getOneTicket(@Param('id') id: string) {
    return this.service.getTicket(id);
  }

  @Override('getManyBase')
  @Roles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN)
  @ApiOperation({ summary: 'Retrieve all tickets (Pagination applied)' })
  async getManyTickets(@Query() query) {
    return await this.service.getAllTickets(query.page, query.limit)
  }

  @Get('users/:user_id')
  @ApiOperation({ summary: 'Retrieve all tickets by user ID' })
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
  @Post(':ticket_id/update-image')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileFieldsInterceptor([{ name: 'attachment', maxCount: 3 }]))
  public async updateImage(
    @Param('ticket_id') id: string,
    @Body() dto: AddMessageidTicketDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    let attachments = [];
    attachments = [...(await files['attachment'])];
    for (let i = 0; i < attachments.length; i++) {
      const driver = this.configService.get('file.driver');
      const picture = {
        local: `/${this.configService.get('app.apiPrefix')}/v1/${
          files['attachment'][i].path
        }`,
        s3: files['attachment'][i].location,
        firebase: files['attachment'][i].publicUrl,
      };
      await this.service.updateTicketPicture(
        id,
        dto.message_id,
        picture[driver],
      );
    }
    return { message: 'Ticket Created Successfully' };
  }
  // design api for updating status from pending to completed

  @Post(':id/status')
  @ApiOperation({ summary: 'Change Status from PENDING to COMPLETED' })
  async ticketStatus(@Param('id') id: string) {
    return this.service.updateStatus(id);
  }
}
