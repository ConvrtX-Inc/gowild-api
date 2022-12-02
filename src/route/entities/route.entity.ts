import { ApiProperty } from '@nestjs/swagger';
import { Allow, IsOptional } from 'class-validator';
import { AbstractBaseEntity } from 'src/common/abstract-base-entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { FileEntity } from '../../files/file.entity';
import { RouteHistoricalEvent } from '../../route-historical-events/entities/route-historical-event.entity';
import { AppPoint } from '../../common/lat-lng.embedded';
import { Geometry } from 'geojson';
import { UserEntity } from '../../users/user.entity';
import {RoleEnum} from "../../roles/roles.enum";

export class Coordinates {
  @ApiProperty({
    format: 'double',
    type: 'number',
    nullable: false
  })
  latitude: number;

  @ApiProperty({
    format: 'double',
    type: 'number',
    nullable: false
  })
  longitude: number;
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
  @ApiProperty({ example: 'Second On the List', nullable: true })
  @Column({
    length: 50,
    nullable: true,
    name: 'sub_title'
  })
  subTitle?: string;

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

  @Allow()
  @ApiProperty({ nullable: true, type: () => FileEntity })
  @ManyToOne(() => FileEntity, { nullable: true, cascade: false, eager: true })
  @JoinColumn({ name: 'picture_id' })
  picture: FileEntity;

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

  @Column({
    type: 'boolean',
    default: false
  })
  saved: boolean;
}
