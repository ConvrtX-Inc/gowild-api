import { Column, Entity, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Allow, IsOptional, Validate } from 'class-validator';
import { AbstractBaseEntity } from 'src/common/abstract-base-entity';
import { IsExist } from 'src/common/validators/is-exists.validator';
import { TicketMessage } from 'src/ticket-messages/entities/ticket-message.entity';

@Entity('gw_system_support_attachments')
export class SystemSupportAttachment extends AbstractBaseEntity {
  @IsOptional()
  @ApiProperty({ example: 'cbcfa8b8-3a25-4adb-a9c6-e325f0d0f3ae' })
  @Validate(IsExist, ['Ticket', 'id'], {
    message: 'ticket_id not Found',
  })
  @Column({
    type: 'uuid',
    nullable: false,
  })
  ticket_id?: string;

  @Allow()
  @IsOptional()
  @ApiProperty({ example: 'Picture' })
  @Column({ nullable: true })
  attachment?: string | null;

  @Column({
    type: 'uuid',
    nullable: true,
  })
  message_id?: string;
}
