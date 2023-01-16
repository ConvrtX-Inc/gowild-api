import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractBaseEntity } from '../../common/abstract-base-entity';
import { ApiProperty } from '@nestjs/swagger';
import { Allow, IsOptional } from 'class-validator';

export enum bulkEmailSendEnum {
  PENDING = 'pending',
  sent = 'sent',
}

@Entity('gw_bulk-email-send')
export class bulkEmailSend extends AbstractBaseEntity {
  @ApiProperty({ example: 'cbcfa8b8-3a25-4adb-a9c6-e325f0d0f3ae' })
  @Column({
    type: 'uuid',
    nullable: false,
  })
  user_id?: string;

  @ApiProperty({ example: 'abc@gmail.com', nullable: true })
  @Column({ nullable: true, name: 'email' })
  email: string | null;

  @ApiProperty({ nullable: true })
  @Column({ nullable: true, name: 'status' })
  status: bulkEmailSendEnum;

  @IsOptional()
  @ApiProperty({ example: '07:04' })
  @Column({ nullable: false, name: 'event_time' })
  sent_at: Date;
}
