import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Repository } from 'typeorm';
import { Ticket, TicketStatusEnum } from './entities/ticket.entity';
import { DeepPartial } from '../common/types/deep-partial.type';
import { UserEntity } from '../users/user.entity';
import { NotFoundException } from '../exceptions/not-found.exception';
import { SystemSupportAttachmentService } from '../system-support-attachment/system-support-attachment.service';
import { NotificationService } from '../notification/notification.service';
import { TicketMessagesService } from '../ticket-messages/ticket-messages.service';
import {NotificationTypeEnum} from "../notification/notification-type.enum";
import {TicketMessage} from "../ticket-messages/entities/ticket-message.entity";

@Injectable()
export class TicketService extends TypeOrmCrudService<Ticket> {
  constructor(
    @InjectRepository(Ticket)
    private ticketRepository: Repository<Ticket>,
    private readonly systemSupportAttachmentService: SystemSupportAttachmentService,
    private readonly notificationService: NotificationService,
    private readonly ticketMessageService: TicketMessagesService,
  ) {
    super(ticketRepository);
  }

  async createTicket(dto: any, req: any) {
    const newTicket = {
      user_id: req,
      subject: dto.subject,
    };
    const user = await UserEntity.findOne({
      id: req,
    });
    const ticket = await this.saveEntity(newTicket);

    await this.ticketMessageService.createTicketMessage(
      ticket.id,
      dto.message,
      ticket.user_id,
    );

    const findMessage = await this.ticketMessageService.findOneEntity({
      where: {
        ticket_id: ticket.id,
        user_id: ticket.user_id,
      },
    });

    ticket['user'] = user;
    ticket['message_id'] = findMessage.id;

    await this.notificationService.createNotificationAdmin(
      `${user.firstName} ${user.lastName} created a new ticket!`,
        NotificationTypeEnum.SUPPORT,
    );

    return {
      message: 'Ticket Created Successfully!',
      data: ticket,
    };
  }

  // get ticket by id
  async getTicket(id: string) {
    const ticket = await this.ticketRepository.findOne({ where: { id: id } });

    ticket['attachment'] =
      await this.systemSupportAttachmentService.findManyEntities({
        where: { ticket_id: id },
      });
    return {
      message: 'Ticket Fetched Successfully!',
      data: ticket,
    };
  }

  // get ticket by user_id
  async getTicketsByUserId(id: string) {
    const tickets = await this.ticketRepository
      .createQueryBuilder('ticket')
      .where('ticket.user_id = :id', { id: id })
      .leftJoinAndMapOne(
        'ticket.user',
        UserEntity,
        'user',
        'ticket.user_id = user.id',
      )
      //.leftJoinAndMapMany('ticket.attachment', SystemSupportAttachment, 'attachment', 'ticket.id = attachment.ticket_id')
      .getMany();

    return {
      message: 'Ticket Fetched Successfully!',
      data: tickets,
    };
  }

  // get all tickets
  async getAllTickets(pageNo: number, limit: number) {
    const take = limit || 100;
    const page = pageNo || 1;
    const skip = (page - 1) * take;
    const [tickets,total] = await this.ticketRepository.createQueryBuilder('ticket')
        .leftJoinAndMapOne('ticket.user', UserEntity, 'user', 'ticket.user_id = user.id')
        .leftJoinAndMapOne('ticket.message', TicketMessage, 'message', 'message.ticket_id = ticket.id')
        .select(['ticket', 'message', 'user.firstName','user.lastName', 'user.username', 'user.email', 'user.picture'])
        .skip(skip)
        .take(take)
        .orderBy('message.createdDate', 'DESC')
        .getManyAndCount();

    const messageCount = await this.ticketRepository.createQueryBuilder('ticket')
        .leftJoinAndMapMany('ticket.message', TicketMessage, 'message', 'message.ticket_id = ticket.id AND message.user_id = ticket.user_id')
        .select(['ticket','message'])
        .orderBy('message.createdDate', 'DESC')
        .getMany()

    tickets.forEach(ticket => {
      let unreadMessageCount = 0;
      messageCount.forEach(item => {
        if (ticket['id'] === item['id']) {
          const filteredMessages = item['message'].filter(message => message.adminSeen === false);
          unreadMessageCount = filteredMessages.length;
        }
      });
      ticket['unread_message_count'] = unreadMessageCount;
    });

    if (tickets.length === 0) {
      throw new NotFoundException({
        errors: [
          {
            message: 'Tickets not Found!',
          },
        ],
      });
    }
    const totalPage = Math.ceil(total / take);
    const currentPage = parseInt(String(page));
    const prevPage = page > 1 ? page - 1 : null;
    return {
      message: 'Tickets fetched Successfully!',
      data: tickets,
      count: total,
      currentPage,
      prevPage,
      totalPage,
    };
  }

  async updateTicketPicture(id: string, message_id: string, image: string) {
    const ticket = await this.ticketMessageService.findOneEntity({
      where: {
        ticket_id: id,
        id: message_id,
      },
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
    const saveAttachment =
      await this.systemSupportAttachmentService.createSupportAttachment(
        image,
        id,
        message_id,
      );
    return saveAttachment;
  }

  async updateStatus(id) {
    const status = await this.ticketRepository.findOne({
      where: {
        id: id,
        status: TicketStatusEnum.Pending,
      },
    });
    if (!status) {
      throw new NotFoundException({
        errors: [{ message: 'Ticket not Found!' }],
      });
    }
    status.status = TicketStatusEnum.Completed;
    await status.save();
    return {
      message: 'Status Changed Successfully!',
    };
  }

  async saveEntity(data: DeepPartial<Ticket>) {
    return this.ticketRepository.save(this.ticketRepository.create(data));
  }
}
