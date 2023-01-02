import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, Validate } from 'class-validator';
import { AbstractBaseEntity } from 'src/common/abstract-base-entity';
import { IsExist } from 'src/common/validators/is-exists.validator';
import { Column, Entity, ManyToOne } from 'typeorm';

export enum TicketStatusEnum {
  Completed = 'completed',
  Pending = 'pending',
  OnHold = 'onhold',
}

@Entity('gw_tickets')
export class Ticket extends AbstractBaseEntity {
  @ApiProperty({ example: 'cbcfa8b8-3a25-4adb-a9c6-e325f0d0f3ae' })
  @Validate(IsExist, ['UserEntity', 'id'], {
    message: 'User Id not Found',
  })
  @Column({
    type: 'uuid',
    nullable: false,
  })
  user_id?: string;

  @IsOptional()
  @ApiProperty({ example: 'Uploading of Attachment' })
  @Column({
    length: 50,
    nullable: true,
  })
  subject?: string;

  @IsOptional()
  @ApiProperty({ example: 'Description' })
  @Column({ type: 'text' })
  message?: string;


  @IsOptional()
  @ApiProperty({
    example: TicketStatusEnum.OnHold,
    nullable: true,
    enum: TicketStatusEnum,
    enumName: 'TicketStatusEnum',
})
  @Column({ nullable: true, enum: TicketStatusEnum, enumName: 'TicketStatusEnum', default: TicketStatusEnum.Pending })
  status: TicketStatusEnum
}
