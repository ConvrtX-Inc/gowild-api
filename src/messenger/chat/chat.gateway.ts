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

import { RoomService } from '../room/room.service';
import { ClientSocketInfo } from './clientSocketInfo';
import { RoomInfo } from './roomInfo';

@WebSocketGateway({ namespace: '/chat', cors: true })
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() wss: Server;
  private logger: Logger = new Logger('ChatGateway');
  private lstClients = [];
  private lstRooms = [];

  constructor(private _roomService: RoomService) {}

  afterInit(server: Server) {
    this.logger.log('Initialized ChatGateway!');
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);

    const room = this.getRoomOfClient(client);
    if (room != '') {
      this.leaveRoom(client, room);
    }
  }

  @SubscribeMessage('connect_users')
  async connect(client: Socket, payload: any): Promise<void> {
    const roomId = await this._roomService.ConnectConversation(
      payload.sender_id,
      payload.receiver_id,
    );
    this.logger.log(`Connect Conversation ` + roomId);
    this.addClient(client, payload.sender_id, roomId);
    this.joinRoom(client, roomId);
  }

  @SubscribeMessage('msgToServer')
  async handleMessage(client: Socket, payload: any) {
    const curDate = new Date();
    const _message = {
      user_id: payload.user_id,
      message: payload.message,
      msSent: 1,
      date: curDate,
      attachment: payload.attachment,
    };
    const room = this.getRoomOfClient(client);
    const message = await this.addMessage(_message, room);
    this.wss.to(room).emit('msgToClient', message);
  }

  @SubscribeMessage('joinRoom')
  public joinRoom(client: Socket, room: string): void {
    this.logger.log('joinRoom : ' + room);
    client.join(room);
    client.emit('joinedRoom', room);
  }

  @SubscribeMessage('leaveRoom')
  public leaveRoom(client: Socket, room: string): void {
    this.logger.log(`leaveRoom`);
    client.leave(room);
    client.emit('leftRoom', room);
    this.deleteClient(client);

    this.saveMessage(room);
  }

  addClient(client: Socket, sender_id: string, room: string) {
    const c = new ClientSocketInfo(client.id, room, sender_id);
    this.lstClients.push(c);

    const objRoom = this.lstRooms.find((o) => o.RoomID === room);
    if (objRoom === undefined) {
      const rm = new RoomInfo(room);
      rm.UserMessages = [];
      this.lstRooms.push(rm);
    }
  }

  deleteClient(client: Socket) {
    for (let i = 0; i < this.lstClients.length; i++) {
      if (this.lstClients[i]['ClientID'] === client.id) {
        this.lstClients.splice(i, 1);
        break;
      }
    }
  }

  getRoomOfClient(client: Socket): string {
    let res = '';
    const objClient = this.lstClients.find((o) => o.ClientID === client.id);
    if (objClient != undefined) {
      res = objClient.RoomID;
    }
    return res;
  }

  async saveMessage(roomID: string) {
    this.logger.log('saveMessage:' + roomID);
    const objRoom = this.lstRooms.find((o) => o.RoomID === roomID);
    if (objRoom != undefined) {
      if (objRoom.UserMessages.length > 0) {
        const message = objRoom.UserMessages[0];
        objRoom.UserMessages = [];
        return await this._roomService.saveMessagesofRoom(roomID, message);
      }
    }
  }

  async addMessage(UserMessage: any, clientRoom: string) {
    const objRoom = this.lstRooms.find((o) => o.RoomID === clientRoom);
    if (objRoom === undefined) {
      const rm = new RoomInfo(clientRoom);
      rm.UserMessages.push(UserMessage);
      this.lstRooms.push(rm);
      return await this.saveMessage(clientRoom);
    } else {
      objRoom.UserMessages.push(UserMessage);
      return await this.saveMessage(clientRoom);
    }
  }
}
