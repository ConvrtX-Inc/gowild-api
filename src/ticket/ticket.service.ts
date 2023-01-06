import {HttpStatus, Injectable} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Repository } from 'typeorm';
import { Ticket } from './entities/ticket.entity';
import {DeepPartial} from "../common/types/deep-partial.type";
import {Comment} from "../comment/entities/comment.entity";
import {UserEntity} from "../users/user.entity";
import {NotFoundException} from "../exceptions/not-found.exception";

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
    message: "Ticket Created Successfully!",
    data: ticket
   }
  }

  // get ticket by id
  public async getTicket(id: string){
    const ticket = await this.ticketRepository.findOne({ where:{ id: id } })

    return{
      message: 'Ticket Fetched Successfully!',
      data: ticket
    }
  }

  // get ticket by user_id
  async getTicketsByUserId(id: string){

    const tickets = await this.ticketRepository.createQueryBuilder('ticket')
        .where("ticket.user_id = :id",{id: id})
        .leftJoinAndMapOne('ticket.user', UserEntity, 'user', 'ticket.user_id = user.id')
        .getMany()

    return {
      message: 'Ticket Fetched Successfully!' ,
      data: tickets
    }
  }

  public async updateTicketPicture(id: string, image: string) {
    const ticket = await this.ticketRepository.findOne({
      where: { id: id },
    });


    if (!ticket) {
      throw new NotFoundException({
        errors: [
          {
            user: 'Ticket does not exist',
          },
        ],
      });
    }

    ticket.image= image;
    return{ message: "Ticket's Image Updated Successfully!", data: await ticket.save()};
  }

  async saveEntity(data: DeepPartial<Ticket>) {
    return this.ticketRepository.save(this.ticketRepository.create(data));
  }
}
