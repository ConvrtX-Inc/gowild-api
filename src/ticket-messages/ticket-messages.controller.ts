import {Controller, Get, Param, UseGuards} from '@nestjs/common';
import { TicketMessagesService } from './ticket-messages.service';
import {ApiBearerAuth, ApiOperation, ApiTags} from '@nestjs/swagger';
import { TicketMessage } from './entities/ticket-message.entity';
import { Crud, CrudController } from '@nestjsx/crud';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {Query} from "@nestjs/common/decorators";

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
  public async getTicketMessages(@Param('ticket_id') ticketId: string, @Query() query) {
    return this.service.getTicketMessages(ticketId, query.page);
  }
}
