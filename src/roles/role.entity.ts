import { Column, Entity, PrimaryColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Allow } from 'class-validator';
import { AbstractBaseEntity } from 'src/common/abstract-base-entity';

@Entity('gw_roles')
export class Role extends AbstractBaseEntity {
  @ApiProperty({ example: 1 })
  @PrimaryColumn()
  id: string;

  @Allow()
  @ApiProperty({ example: 'Admin' })
  @Column()
  name?: string;
}
