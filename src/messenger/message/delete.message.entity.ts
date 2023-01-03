import { Column, Entity } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, Validate } from 'class-validator';
import { AbstractBaseEntity } from 'src/common/abstract-base-entity';
import { IsExist } from 'src/common/validators/is-exists.validator';


@Entity('gw_deleted_messages')
export class DeletedMessage extends AbstractBaseEntity {
  @IsOptional()
  @ApiProperty({ example: 'cbcfa8b8-3a25-4adb-a9c6-e325f0d0f3ae' })
  @Column({ nullable: true, type: 'uuid' })
  message_id?: string ;

  @IsOptional()
  @ApiProperty({ example: 'cbcfa8b8-3a25-4adb-a9c6-e325f0d0f3ae' })
  @Validate(IsExist, ['UserEntity', 'id'], {
    message: 'User not Found',
  })
  @Column({ nullable: true, type: 'uuid' })
  user_id?: string;

  @IsOptional()
  @ApiProperty({ example: 'cbcfa8b8-3a25-4adb-a9c6-e325f0d0f3ae' })
  @Column({ nullable: true, type: 'uuid'})
  room_id?: string;
}
