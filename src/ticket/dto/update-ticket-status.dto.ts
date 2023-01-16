import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { TicketStatusEnum } from '../entities/ticket.entity';

export class ChangeTicketStatusDto {
  @ApiProperty({ example: 'completed' })
  @IsNotEmpty()
  status: TicketStatusEnum;
}
