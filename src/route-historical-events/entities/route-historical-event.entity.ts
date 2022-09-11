import { ApiProperty } from '@nestjs/swagger';
import { Allow, IsOptional, Validate } from 'class-validator';
import { AbstractBaseEntity } from 'src/common/abstract-base-entity';
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne } from 'typeorm';
import { Route } from '../../route/entities/route.entity';
import { AppPoint } from '../../common/lat-lng.embedded';
import { Geometry } from 'geojson';
import { FileEntity } from '../../files/file.entity';
import { JoinTable } from 'typeorm/browser';
import { IsExist } from '../../common/validators/is-exists.validator';

@Entity('gw_route_historical_events')
export class RouteHistoricalEvent extends AbstractBaseEntity {
  @ApiProperty({ example: 'cbcfa8b8-3a25-4adb-a9c6-e325f0d0f3ae' })
  @Validate(IsExist, ['Route', 'id'], {
    message: 'Route Id not Found',
  })
  @Column({
    type: 'uuid',
    nullable: false,
  })
  route_id?: string;

  @IsOptional()
  @ApiProperty({ example: '830759078-477' })
  @Column({
    length: 50,
    nullable: true,
  })
  closureUid?: string;

  @IsOptional()
  @Allow()
  @ApiProperty({ type: () => AppPoint })
  @Column({
    type: 'geometry',
    nullable: true,
  })
  point?: Geometry;

  @IsOptional()
  @ApiProperty({ example: 'First On the List' })
  @Column({
    length: 50,
    nullable: true,
  })
  title?: string;

  @IsOptional()
  @ApiProperty({ example: 'Subtitle' })
  @Column({
    length: 50,
    nullable: true,
  })
  subtitle?: string;

  @IsOptional()
  @ApiProperty({ example: 'description' })
  @Column({ nullable: true })
  description?: string;

  @Allow()
  @ApiProperty({ nullable: true, type: () => FileEntity })
  @ManyToOne(() => FileEntity, { nullable: true, cascade: false, eager: true })
  @JoinColumn({ name: 'picture_id' })
  picture: FileEntity;

  @Allow()
  @ApiProperty({ nullable: true, type: [FileEntity] })
  @ManyToMany(() => FileEntity)
  @JoinTable({ name: 'gw_route_historical_event_medias' })
  medias: FileEntity[];
}
