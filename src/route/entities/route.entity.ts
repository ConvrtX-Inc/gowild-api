import { ApiProperty } from '@nestjs/swagger';
import { Allow, IsOptional } from 'class-validator';
import { AbstractBaseEntity } from 'src/common/abstract-base-entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { FileEntity } from '../../files/file.entity';
import { RouteHistoricalEvent } from '../../route-historical-events/entities/route-historical-event.entity';
import { AppPoint } from '../../common/lat-lng.embedded';
import { Geometry } from 'geojson';
import { UserEntity } from '../../users/user.entity';
import { RoleEnum } from "../../roles/roles.enum";
import { Coordinates } from "../../common/coordinates";
import { time } from 'aws-sdk/clients/frauddetector';

export enum RouteStatusEnum {
  Approved = 'approved',
  Pending = 'pending',
  Reject = 'reject'
}


@Entity('gw_routes')
export class Route extends AbstractBaseEntity {
  @ApiProperty({ example: 'cbcfa8b8-3a25-4adb-a9c6-e325f0d0f3ae' })
  @Column({
    type: 'uuid',
    nullable: false,
  })
  user_id?: string;

  @IsOptional()
  @ApiProperty({ example: 'First On the List', nullable: true })
  @Column({
    length: 50,
    nullable: true,
  })
  title: string;

  @IsOptional()
  @ApiProperty({nullable: true })
  @Column({nullable: true})
  picture: string;

  @Allow()
  @ApiProperty({ type: () => Coordinates, nullable: false })
  @Column({
    type: 'jsonb',
    nullable: false,
  })
  start: Coordinates;

  @Allow()
  @ApiProperty({ type: () => Coordinates, nullable: false })
  @Column({
    type: 'jsonb',
    nullable: false,
  })
  end: Coordinates;

  @Allow()
  @ApiProperty({ type: () => [RouteHistoricalEvent], nullable: true })
  @OneToMany(() => RouteHistoricalEvent, (obj) => obj.route, {
    cascade: true,
    orphanedRowAction: 'delete',
  })
  historicalEvents?: RouteHistoricalEvent[];

  @IsOptional()
  @ApiProperty({ example: 'description', nullable: true })
  @Column({ type: 'text' })
  description?: string;

  @Column({
    type: "enum",
    enum: RoleEnum,
    default: RoleEnum.USER
  })
  role: RoleEnum;

  @ApiProperty({ example: '01:04:00' })
  @Column({ nullable: true, name: 'estimate_time' })
  estimate_time: string;

  @ApiProperty({ example: '2 Miles' })
  @Column({ nullable: true, name: 'distance_miles' })
  distance_miles: number;

  @ApiProperty({ example: '500m' })
  @Column({ nullable: true, name: 'distance_meters' })
  distance_meters: number;

  @IsOptional()
  @ApiProperty({
    example: 'pending/completed',
    nullable: true,
    enum: RouteStatusEnum,
    enumName: 'RouteStatusEnum',
  })
  @Column({ nullable: true, enum: RouteStatusEnum, enumName: 'RouteStatusEnum', default: RouteStatusEnum.Pending })
  status: RouteStatusEnum

}

