import { IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Column } from 'typeorm';

export class CreateMessageDto {
  @IsOptional()
  @ApiProperty({ example: 'edb8f39a-0d06-4466-ba25-253c0ac54522' })
  @Column({ type: 'uuid', nullable: false })
  user_id?: string;

  @IsOptional()
  @ApiProperty({ example: 'edb8f39a-0d06-4466-ba25-253c0ac54522' })
  @Column({ type: 'text', nullable: false })
  message?: string;

  @IsOptional()
  @ApiProperty({ example: 'edb8f39a-0d06-4466-ba25-253c0ac54522' })
  @Column({ type: 'text', nullable: true })
  attachment?: {
    extension: string;
    base64: string;
  };
}
