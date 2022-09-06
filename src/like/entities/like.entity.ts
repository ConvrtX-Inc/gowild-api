import { ApiProperty } from '@nestjs/swagger';
import { Validate } from 'class-validator';
import { AbstractBaseEntity } from 'src/utils/abstract-base-entity';
import { IsExist } from 'src/utils/validators/is-exists.validator';
import { Column, Entity } from 'typeorm';

@Entity('gw_likes')
export class Like extends AbstractBaseEntity {
  @ApiProperty({ example: 'cbcfa8b8-3a25-4adb-a9c6-e325f0d0f3ae' })
  @Validate(IsExist, ['User', 'id'], {
    message: 'User not Found',
  })
  @Column({
    type: 'uuid',
    nullable: false,
  })
  user_id?: string;

  @ApiProperty({ example: '56320f5c-9236-424c-9eb2-339fa9dbb3cb' })
  @Validate(IsExist, ['PostFeed', 'id'], {
    message: 'Post Feed id not Found',
  })
  @Column({
    type: 'uuid',
    nullable: false,
  })
  postfeed_id?: string;
}
