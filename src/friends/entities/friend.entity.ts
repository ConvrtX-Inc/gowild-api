import { ApiProperty } from '@nestjs/swagger';
import { Allow, Validate } from 'class-validator';
import { AbstractBaseEntity } from 'src/utils/abstract-base-entity';
import { IsExist } from 'src/utils/validators/is-exists.validator';
import { Column, Entity } from 'typeorm';

@Entity('gw_friends')
export class Friends extends AbstractBaseEntity {
  @ApiProperty({ example: 'cbcfa8b8-3a25-4adb-a9c6-e325f0d0f3ae' })
  @Validate(IsExist, ['User', 'id'], {
    message: 'User not Found',
  })
  @Column({
    type: 'uuid',
    nullable: false,
  })
  user_id?: string;

  @ApiProperty({ example: 'cbcfa8b8-3a25-4adb-a9c6-e325f0d0f3ae' })
  @Validate(IsExist, ['User', 'id'], {
    message: 'User not Found',
  })
  @Column({
    type: 'uuid',
    nullable: false,
  })
  friend_id?: string;

  @Allow()
  @ApiProperty({ example: false })
  @Column({
    type: 'boolean',
    nullable: false,
  })
  is_approved?: boolean;
}
