import { Column, Entity } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, Allow } from 'class-validator';
import { AbstractBaseEntity } from 'src/common/abstract-base-entity';

@Entity('gw_postfeed-attachments')
export class PostFeedAttachment extends AbstractBaseEntity {
  @IsOptional()
  @ApiProperty({ example: 'uuid' })
  @Column({ nullable: true, type: 'uuid', name: 'postfeed_id' })
  postfeed_id?: string | null;

  @Allow()
  @IsOptional()
  @ApiProperty({ example: 'Picture' })
  @Column({ nullable: true })
  attachment?: string;
}
