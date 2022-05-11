import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Repository } from 'typeorm';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { Ticket } from './entities/ticket.entity';

@Injectable()
export class TicketService extends TypeOrmCrudService<Ticket> {
  constructor(@InjectRepository(Ticket)
  private ticketRepository: Repository<Ticket>,
  ){
    super(ticketRepository);
  }
}
