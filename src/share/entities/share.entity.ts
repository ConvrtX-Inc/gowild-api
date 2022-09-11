import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, Validate } from 'class-validator';
import { AbstractBaseEntity } from 'src/common/abstract-base-entity';
import { IsExist } from 'src/common/validators/is-exists.validator';
import { Column, Entity } from 'typeorm';

@Entity('gw_shares')
export class Share extends AbstractBaseEntity {
  @ApiProperty({ example: 'd0db6de5-c0b0-450c-a56a-492ee9ed3a7b' })
  @Validate(IsExist, ['User', 'id'], {
    message: 'User Not Found',
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
  post_feed_id?: string;

  @IsOptional()
  @ApiProperty({ example: 'www.gowild.com' })
  @Column({
    type: 'text',
    nullable: true,
    default: 'www.gowild.com',
  })
  url: string | null;
}
