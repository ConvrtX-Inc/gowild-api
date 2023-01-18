import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { bulkEmailSendService } from './bulk-email-send-service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CrudController } from '@nestjsx/crud';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Query } from '@nestjs/common/decorators';
import { bulkEmailSend } from './entities/bulk-email-send-entity';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Bulk Email Send')
@Controller({
  path: 'bulk-email-send',
  version: '1',
})
export class bulkEmailSendController implements CrudController<bulkEmailSend> {
  constructor(readonly service: bulkEmailSendService) {}

  @ApiOperation({ summary: 'Get Ticket Messages' })
  @Get('/:ticket_id')
  public async getTicketMessages(
    @Param('ticket_id') ticketId: string,
    @Query() query,
  ) {
    return 1;
  }
}
