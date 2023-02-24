import { IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Column } from 'typeorm';
import { RoleEnum } from '../../roles/roles.enum';

export class CreateSupportMessageDto {
  @IsOptional()
  @ApiProperty({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' })
  @Column({ type: 'uuid', nullable: true })
  ticket_id?: string;

  @IsOptional()
  @ApiProperty({ example: 'Description' })
  @Column({ nullable: true })
  message?: string;

  @IsOptional()
  @ApiProperty({ example: 'admin / user' })
  @Column({ nullable: true })
  role?: string;

  @IsOptional()
  @ApiProperty({ example: 'Attachment' })
  @Column({ nullable: true })
  attachment?: {
    extension: string;
    base64: string;
  };
}
