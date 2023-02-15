import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { TicketMessagesService } from './ticket-messages.service';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TicketMessage } from './entities/ticket-message.entity';
import { CrudController } from '@nestjsx/crud';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { HttpCode, Query, UploadedFile, UseInterceptors } from '@nestjs/common/decorators';
import { CreateTicketMessageDto } from './dto/create-ticket-message.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Ticket Messages')
@Controller({
  path: 'ticket-messages',
  version: '1',
})
export class TicketMessagesController implements CrudController<TicketMessage> {
  constructor(readonly service: TicketMessagesService, private readonly configService: ConfigService,) {}

  // Update File

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
 @Post('/update-file/:ticket_id')
 @HttpCode(HttpStatus.OK)
 @UseInterceptors(FileInterceptor('file'))
 public async updateImage(
   @Request() request: Express.Request,
   @Param('ticket_id') ticket_id: string,
   @UploadedFile() file: Express.Multer.File,
 ) {
   const driver = this.configService.get('file.driver');
   const attachment = {
     local: `/${this.configService.get('app.apiPrefix')}/v1/${file.path}`,
     s3: file.location,
     firebase: file.publicUrl,
   };
   return this.service.updateFile(ticket_id,request.user.sub, attachment[driver]);
 }


  @ApiOperation({ summary: 'Get Ticket Messages' })
  @Get('/:ticket_id')
  public async getTicketMessages(@Request() req,
    @Param('ticket_id') ticketId: string,
    @Query() query,
  ) {
    return this.service.getTicketMessages(req.user.sub,ticketId, query.page, query.limit);
  }

  @ApiOperation({ summary: 'Create Ticket Messages' })
  @Post('/:ticket_id')
  public async createTicketMessages(
    @Param('ticket_id') ticketId: string,
    @Body() dto: CreateTicketMessageDto,
    @Request() req,
  ) {
    return await this.service.createTicketMessage(
      ticketId,
      dto.message,
      req.user.sub,
    );
  }
}
