import { Column, Entity } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, Validate } from 'class-validator';
import { AbstractBaseEntity } from 'src/common/abstract-base-entity';
import { IsExist } from 'src/common/validators/is-exists.validator';

@Entity('gw_notifications')
export class Notification extends AbstractBaseEntity {
  @IsOptional()
  @ApiProperty({ example: 'cbcfa8b8-3a25-4adb-a9c6-e325f0d0f3ae' })
  @Validate(IsExist, ['UserEntity', 'id'], {
    message: 'User not Found',
  })
  @Column({ nullable: true , type: 'uuid'})
  user_id?: string | null;

  @IsOptional()
  @ApiProperty({ example: 'true/false ' })
  @Column({nullable: true, default: false})
  is_seen?: boolean;

  @IsOptional()
  @ApiProperty({ example: 'notification_msg' })
  @Column({ length: 100, nullable: true })
  notification_msg?: string;

  @IsOptional()
  @ApiProperty({ example: 'home' })
  @Column({ length: 100, nullable: true, default:'home' })
  type?: string;

  @IsOptional()
  @ApiProperty({ example: 'admin' })
  @Column({ length: 100, nullable: false, default:'user' })
  role?: string;
}
