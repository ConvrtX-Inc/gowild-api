import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, Validate } from 'class-validator';
import { AbstractBaseEntity } from 'src/common/abstract-base-entity';
import { IsExist } from 'src/common/validators/is-exists.validator';
import { Column, Entity, PrimaryGeneratedColumn , CreateDateColumn, UpdateDateColumn} from 'typeorm';

@Entity('gw_comments')
export class Comment extends AbstractBaseEntity {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'd0db6de5-c0b0-450c-a56a-492ee9ed3a7b' })
  @Validate(IsExist, ['UserEntity', 'id'], {
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
  postfeed_id?: string;

  @IsOptional()
  @ApiProperty({ example: 'message' })
  @Column({ nullable: true })
  message?: string;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;
}
