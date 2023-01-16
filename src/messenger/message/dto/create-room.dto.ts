import { IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Column } from 'typeorm';

export class CreateRoomDto {
  @IsOptional()
  @ApiProperty({ example: 'edb8f39a-0d06-4466-ba25-253c0ac54522' })
  @Column({ type: 'uuid', nullable: false })
  sender_id?: string;

  @IsOptional()
  @ApiProperty({ example: 'edb8f39a-0d06-4466-ba25-253c0ac54522' })
  @Column({ type: 'uuid', nullable: false })
  recipient_id?: string;
}
