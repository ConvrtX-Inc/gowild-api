import {
  Column,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Allow, IsOptional } from 'class-validator';
import { EntityHelper } from 'src/utils/entity-helper';

@Entity()
export class Currency extends EntityHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Allow()
  @IsOptional()
  @ApiProperty({ example: 'php' })
  @Column({ nullable: true })
  currency_code?: string;

  @Allow()
  @IsOptional()
  @ApiProperty({ example: 'name' })
  @Column({ nullable: true })
  currency_name?: string;

  @Allow()
  @IsOptional()
  @ApiProperty({ example: 'symbol' })
  @Column({ nullable: true })
  currency_symbol?: string;

  @IsOptional()
  @DeleteDateColumn()
  deletedAt: Date;
}
