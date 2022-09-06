import { Column, Entity } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, Validate } from 'class-validator';
import { AbstractBaseEntity } from 'src/utils/abstract-base-entity';
import { Transform } from 'class-transformer';
import { IsExist } from '../utils/validators/is-exists.validator';

@Entity('gw_social_accounts')
export class SocialAccount extends AbstractBaseEntity {
  @IsOptional()
  @ApiProperty({
    example: 'cbcfa8b8-3a25-4adb-a9c6-e325f0d0f3ae',
    nullable: false,
  })
  @Transform((value: null | string) => (value == null ? '' : value))
  @Validate(IsExist, ['User', 'id'], {
    message: 'User not Found',
  })
  @Column({ nullable: true })
  userId?: string | null;

  @IsOptional()
  @ApiProperty({ nullable: true })
  @Column({ length: 100, nullable: true })
  description?: string;

  @IsOptional()
  @ApiProperty({ nullable: true })
  @Column({ length: 100, nullable: true })
  accountEmail?: string;

  @IsOptional()
  @ApiProperty({ nullable: true })
  @Column({ length: 100, nullable: true })
  socialId?: string;

  @IsOptional()
  @ApiProperty({ nullable: true })
  @Column({ length: 100, nullable: true })
  provider?: string;
}
