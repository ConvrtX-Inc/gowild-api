import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { SystemSupportService } from './system-support.service';
import { RoleEnum } from '../roles/roles.enum';

@WebSocketGateway({ namespace: '/support', cors: true })
export class SupportGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() wss: Server;
  private logger: Logger = new Logger('SupportGateway');

  constructor(private supportService: SystemSupportService) {}

  afterInit(server: Server) {
    this.logger.log('Initialized SupportGateway!');
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('msgToAdmin')
  public async adminMessage(client: Socket, payload: any): Promise<void> {
    const ticketMessage = {
      ticket_id: payload.ticket_id,
      message: payload.message,
      role: RoleEnum.USER,
      attachment: payload.attachment,
    };
    const message = await this.supportService.addMessage(payload.user_id, ticketMessage);
    this.wss.emit('msgSupport', message);
  }

  @SubscribeMessage('msgToUser')
  public async userMessage(client: Socket, payload: any): Promise<void> {
    const ticketMessage = {
      ticket_id: payload.ticket_id,
      message: payload.message,
      role: RoleEnum.ADMIN,
      attachment: payload.attachment,
    };
    const message = await this.supportService.addMessage(payload.user_id, ticketMessage);
    this.wss.emit('msgSupport', message);
  }
}
