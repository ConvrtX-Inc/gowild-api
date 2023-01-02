import {HttpStatus, Injectable} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Repository } from 'typeorm';
import { Ticket } from './entities/ticket.entity';
import {DeepPartial} from "../common/types/deep-partial.type";
import {Comment} from "../comment/entities/comment.entity";
import {UserEntity} from "../users/user.entity";

@Injectable()
export class TicketService extends TypeOrmCrudService<Ticket> {
  constructor(
    @InjectRepository(Ticket)
    private ticketRepository: Repository<Ticket>,
  ) {
    super(ticketRepository);
  }

  async createTicket(dto: any, req: any){

    const newTicket = {
      user_id: req,
      subject: dto.subject,
      message: dto.message,
      status: dto.status
    }
    const user = await UserEntity.findOne({
      id: req
    });
   const ticket = await this.saveEntity(newTicket);
   ticket['user'] = user;

   return {
     status: HttpStatus.OK,
     data: ticket
   }
  }



  async saveEntity(data: DeepPartial<Ticket>) {
    return this.ticketRepository.save(this.ticketRepository.create(data));
  }
}
