import { ApiProperty } from '@nestjs/swagger';
import { Allow, IsOptional } from 'class-validator';
import { AbstractBaseEntity } from 'src/common/abstract-base-entity';
import { Column, Entity } from 'typeorm';

@Entity('gw_post_feeds')
export class PostFeed extends AbstractBaseEntity {
  @ApiProperty({ example: 'cbcfa8b8-3a25-4adb-a9c6-e325f0d0f3ae' })
  @Column({
    type: 'uuid',
    nullable: false,
  })
  user_id?: string;

  @IsOptional()
  @ApiProperty({ example: 'Thrill Seekers Attractions in Houston' })
  @Column({
    length: 100,
    nullable: true,
  })
  title?: string;

  @IsOptional()
  @ApiProperty({ example: 'message' })
  @Column({ nullable: true })
  description?: string;

  @Allow()
  @IsOptional()
  @ApiProperty({ example: 'Picture' })
  @Column({ nullable: true })
  picture?: string;

  @IsOptional()
  @ApiProperty({ example: 'false' })
  @Column({
    type: 'boolean',
    nullable: false,
  })
  is_published?: boolean;

  @IsOptional()
  @ApiProperty({ example: '23' })
  @Column({
    type: 'integer',
    nullable: false,
    default: 0,
  })
  views?: number;

  @IsOptional()
  @ApiProperty({ example: '23' })
  @Column({
    type: 'integer',
    nullable: false,
    default: 0,
  })
  share?: number;

  //   @AfterLoad()
  //   @AfterUpdate()
  //   updatePicture() {
  //     if (this.picture && this.picture.indexOf('/') === 0) {
  //       this.picture = appConfig().backendDomain + this.picture;
  //     }
  // }
}
