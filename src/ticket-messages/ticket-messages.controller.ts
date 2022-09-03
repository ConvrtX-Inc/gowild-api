import { Controller, UseGuards } from '@nestjs/common';
import { TicketMessagesService } from './ticket-messages.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { TicketMessage } from './entities/ticket-message.entity';
import { Crud, CrudController } from '@nestjsx/crud';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('Ticket Messages')
@Crud({
  model: {
    type: TicketMessage,
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
  path: 'ticket-messages',
  version: '1',
})
export class TicketMessagesController implements CrudController<TicketMessage> {
  constructor(readonly service: TicketMessagesService) {
  }

  get base(): CrudController<TicketMessage> {
    return this;
  }
}
