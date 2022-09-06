import { Column, Entity, PrimaryColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Allow, IsOptional } from 'class-validator';
import { AbstractBaseEntity } from 'src/utils/abstract-base-entity';

@Entity('gw_currencies')
export class Currency extends AbstractBaseEntity {
  @Allow()
  @ApiProperty({ example: 'USD' })
  @PrimaryColumn({ nullable: false, unique: true })
  code?: string;

  @Allow()
  @IsOptional()
  @ApiProperty({ example: 'US Dollar' })
  @Column({ nullable: true })
  name?: string;

  @Allow()
  @IsOptional()
  @ApiProperty({ example: 'US Dollars' })
  @Column({ nullable: true })
  namePlural?: string;

  @Allow()
  @IsOptional()
  @ApiProperty({ example: '$' })
  @Column({ nullable: true })
  symbol?: string;
}
