import { Column, Entity } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Allow, IsOptional } from 'class-validator';
import { AbstractBaseEntity } from 'src/common/abstract-base-entity';
import { StatusEnum } from '../auth/status.enum';

@Entity('gw_statuses')
export class Status extends AbstractBaseEntity {
  @Allow()
  @ApiProperty({ example: '2', type: 'string', enum: StatusEnum })
  @Column({
    enum: StatusEnum,
    enumName: 'StatusEnum',
    name: 'status_name',
    nullable: false,
    unique: true,
  })
  statusName: string;

  @Allow()
  @IsOptional()
  @ApiProperty({ example: false })
  @Column({ type: 'bool', nullable: true, default: 'FALSE' })
  isActive?: boolean | null;
}
