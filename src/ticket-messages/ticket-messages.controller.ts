import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { TicketMessagesService } from './ticket-messages.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TicketMessage } from './entities/ticket-message.entity';
import { Crud, CrudController } from '@nestjsx/crud';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Query } from '@nestjs/common/decorators';
import { CreateTicketMessageDto } from './dto/create-ticket-message.dto';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Ticket Messages')
@Controller({
  path: 'ticket-messages',
  version: '1',
})
export class TicketMessagesController implements CrudController<TicketMessage> {
  constructor(readonly service: TicketMessagesService) {}

  @ApiOperation({ summary: 'Get Ticket Messages' })
  @Get('/:ticket_id')
  public async getTicketMessages(
    @Param('ticket_id') ticketId: string,
    @Query() query,
  ) {
    return this.service.getTicketMessages(ticketId, query.page);
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
