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
import { MessageDetail, MessageStatus } from '../message/messageDetail';
import {convertToImage} from "../../common/constants/base64.image";

@WebSocketGateway(5000,{ namespace:'/sockets',  cors: true})
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

    let room = this.getRoomOfClient(client);
    if (room != '') {
      this.leaveRoom(client, room);
    }
  }

  @SubscribeMessage('connect_users')
  public async conect(client: Socket, payload: any): Promise<void> {
    await this._roomService.insertRoom(payload.sender_id, payload.receiver_id);
    this.logger.log(`Connect Conversation ` + this._roomService.newRoomID);
    this.addClient(client, payload.sender_id, this._roomService.newRoomID);
    this.joinRoom(client, this._roomService.newRoomID);
  }

  @SubscribeMessage('msgToServer')
  public handleMessage(client: Socket, payload: any): void {
    var curDate = new Date();
    let attachment = null;
    if (payload.attachment){
      attachment = convertToImage(payload.attachment.base64, payload.attachment.extension);
    }
    let _message = new MessageDetail(
      payload.user_id,
      payload.message,
      MessageStatus.msSent,
      curDate,
      attachment
    );
    payload.attachment = attachment;
    let room = this.getRoomOfClient(client);
    this.addMessage(_message, room);
    this.wss.to(room).emit('msgToClient', payload);
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
    var c = new ClientSocketInfo(client.id, room, sender_id);
    this.lstClients.push(c);

    let objRoom = this.lstRooms.find((o) => o.RoomID === room);
    if (objRoom === undefined) {
      var rm = new RoomInfo(room);
      rm.UserMessages = [];
      this.lstRooms.push(rm);
    }
  }

  deleteClient(client: Socket) {
    for (var i = 0; i < this.lstClients.length; i++) {
      if (this.lstClients[i]['ClientID'] === client.id) {
        this.lstClients.splice(i, 1);
        break;
      }
    }
  }

  getRoomOfClient(client: Socket): string {
    var res = '';
    let objClient = this.lstClients.find((o) => o.ClientID === client.id);
    if (objClient != undefined) {
      res = objClient.RoomID;
    }
    return res;
  }

  async saveMessage(roomID: string) {
    this.logger.log('saveMessage:' + roomID);
    let objRoom = this.lstRooms.find((o) => o.RoomID === roomID);
    if (objRoom != undefined) {
      if (objRoom.UserMessages.length> 0) {
        await this._roomService.saveMessagesofRoom(
          roomID,
          objRoom.UserMessages,
        );
        objRoom.UserMessages = [];
      }
    }
  }

  addMessage(UserMessage: MessageDetail, clientRoom: string) {
    let objRoom = this.lstRooms.find((o) => o.RoomID === clientRoom);
    if (objRoom === undefined) {
      var rm = new RoomInfo(clientRoom);
      rm.UserMessages.push(UserMessage);
      this.lstRooms.push(rm);
      this.saveMessage(clientRoom);
    } else {
      objRoom.UserMessages.push(UserMessage);
      this.saveMessage(clientRoom);
    }
  }
}
