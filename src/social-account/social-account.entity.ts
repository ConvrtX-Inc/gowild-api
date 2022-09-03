import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, Validate } from 'class-validator';
import { EntityHelper } from 'src/utils/entity-helper';
import { IsExist } from 'src/utils/validators/is-exists.validator';
import { Transform } from 'class-transformer';

@Entity('social_accounts')
export class SocialAccount extends EntityHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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

  @CreateDateColumn({ name: 'create_date' })
  createdDate: Date;

  @UpdateDateColumn({ name: 'updated_date' })
  updatedDate: Date;
}
