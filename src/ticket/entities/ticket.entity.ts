import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, Validate } from 'class-validator';
import { AbstractBaseEntity } from 'src/common/abstract-base-entity';
import { IsExist } from 'src/common/validators/is-exists.validator';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Status } from '../../statuses/status.entity';

@Entity('gw_tickets')
export class Ticket extends AbstractBaseEntity {
  @ApiProperty({ example: 'cbcfa8b8-3a25-4adb-a9c6-e325f0d0f3ae' })
  @Validate(IsExist, ['User', 'id'], {
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
  @ApiProperty()
  @Column({
    type: 'text',
    nullable: true,
  })
  img_url: string | null;

  @IsOptional()
  @ApiProperty({ type: Status })
  @ManyToOne(() => Status, { nullable: true })
  status?: Status;
}
