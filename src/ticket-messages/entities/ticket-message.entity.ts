import { ApiProperty } from '@nestjs/swagger';
import { AbstractBaseEntity } from 'src/common/abstract-base-entity';
import { IsExist } from 'src/common/validators/is-exists.validator';
import { Column, Entity } from 'typeorm';
import { IsOptional, Validate } from 'class-validator';

@Entity('gw_ticket_messages')
export class TicketMessage extends AbstractBaseEntity {
  @ApiProperty({ example: '1235CA2B2' })
  @Validate(IsExist, ['Ticket', 'id'], {
    message: 'Ticket Id not Found',
  })
  @Column({
    type: 'uuid',
    nullable: false,
  })
  ticket_id?: string;

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
  @ApiProperty({ example: 'Description' })
  @Column({ type: 'text' })
  message?: string;

  @IsOptional()
  @ApiProperty({example: 'true/false'})
  @Column({name: 'user_seen', type: 'boolean', default: true})
  userSeen: boolean;

  @IsOptional()
  @ApiProperty({example: 'true/false'})
  @Column({name: 'admin_seen', type: 'boolean', default: false})
  adminSeen: boolean;

  @IsOptional()
  @ApiProperty({ example: 'Description' })
  @Column({ type: 'varchar', default: 'user' })
  role?: string;

}
