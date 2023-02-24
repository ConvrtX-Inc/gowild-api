import { IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Column } from 'typeorm';

export class AddMessageidTicketDto {
  @IsOptional()
  @ApiProperty({ example: 'Description' })
  @Column({ type: 'uuid', nullable: true })
  message_id?: string;
}
