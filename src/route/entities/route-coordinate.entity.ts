import { ApiProperty } from '@nestjs/swagger';
import { Allow, IsOptional } from 'class-validator';
import { AbstractBaseEntity } from 'src/common/abstract-base-entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { RouteHistoricalEvent } from '../../route-historical-events/entities/route-historical-event.entity';
import { RoleEnum } from '../../roles/roles.enum';
import { Coordinates } from '../../common/coordinates';
import { float } from 'aws-sdk/clients/lightsail';

export enum RouteStatusEnum {
  Approved = 'approved',
  Pending = 'pending',
  Reject = 'reject',
}

@Entity('gw_route_coordinates')
export class RouteCoordinate extends AbstractBaseEntity {
  @ApiProperty({ example: 'cbcfa8b8-3a25-4adb-a9c6-e325f0d0f3ae' })
  @Column({
    type: 'uuid',
    nullable: false,
  })
  route_id?: string;

  @Allow()
  @ApiProperty({
    format: 'double',
    type: 'number',
    nullable: false,
  })
  latitude: number;

  @ApiProperty({
    format: 'double',
    type: 'number',
    nullable: false,
  })
  longitude: number;

}
