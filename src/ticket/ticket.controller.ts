import { Controller, UseGuards } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Crud, CrudController } from '@nestjsx/crud';
import { Ticket } from './entities/ticket.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

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
  constructor(readonly service: TicketService) {}

  get base(): CrudController<Ticket> {
    return this;
  }
}
