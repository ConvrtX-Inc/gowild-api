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
import {Transform} from "class-transformer";

@Entity()
export class SocialAccount extends EntityHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @IsOptional()
  @ApiProperty({ example: 'cbcfa8b8-3a25-4adb-a9c6-e325f0d0f3ae' })
  @Transform((value: null | string) => (value == null ? '' : value))
  @Validate(IsExist, ['User', 'id'], {
    message: 'User not Found',
  })
  @Column({ nullable: true })
  user_id?: string | null;

  @IsOptional()
  @ApiProperty({ example: 'description' })
  @Column({ length: 100,nullable: true })
  description?: string;

  @IsOptional()
  @ApiProperty({ example: 'account_email' })
  @Column({ length: 100,nullable: true })
  account_email?: string;

  @IsOptional()
  @ApiProperty({ example: 'social_id' })
  @Column({ length: 100,nullable: true })
  social_id?: string;

  @IsOptional()
  @ApiProperty({ example: 'provider' })
  @Column({ length: 100,nullable: true })
  provider?: string;

  @CreateDateColumn()
  created_date: Date;

  @UpdateDateColumn()
  updated_date: Date;

}
