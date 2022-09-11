import { Column, Entity } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { AbstractBaseEntity } from 'src/common/abstract-base-entity';

@Entity('gw_guidelines')
export class Guideline extends AbstractBaseEntity {
  @IsOptional()
  @ApiProperty({ example: 'waiver' })
  @Column({ unique: true, nullable: true, type: 'text' })
  type?: string;

  @IsOptional()
  @ApiProperty({ example: 'description' })
  @Column({ nullable: true, type: 'text' })
  description?: string;

  @IsOptional()
  @ApiProperty({ example: '678036c1-9da6-43ae-bb21-253a5e9b54d5' })
  @Column({ nullable: true, type: 'uuid' })
  last_updated_user?: string; // TODO
}
