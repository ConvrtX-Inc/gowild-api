import { ApiProperty } from '@nestjs/swagger';
import { Allow, IsOptional } from 'class-validator';
import { AbstractBaseEntity } from 'src/common/abstract-base-entity';
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import { Route } from '../../route/entities/route.entity';
import { AppPoint } from '../../common/lat-lng.embedded';
import { Geometry } from 'geojson';
import { FileEntity } from '../../files/file.entity';

@Entity('gw_route_historical_events')
export class RouteHistoricalEvent extends AbstractBaseEntity {
  @Allow()
  @ApiProperty({ nullable: true, type: () => Route })
  @ManyToOne(() => Route, { nullable: true, cascade: false, eager: false })
  @JoinColumn({ name: 'route_id' })
  route: Route;

  @IsOptional()
  @ApiProperty({ example: '830759078-477', nullable: true })
  @Column({
    length: 50,
    nullable: true,
  })
  closureUid?: string;

  @IsOptional()
  @Allow()
  @ApiProperty({ type: () => AppPoint, nullable: true })
  @Column({
    type: 'geometry',
    nullable: true,
  })
  point?: Geometry;

  @IsOptional()
  @ApiProperty({ example: 'First On the List', nullable: true })
  @Column({
    length: 50,
    nullable: true,
  })
  title?: string;

  @IsOptional()
  @ApiProperty({ example: 'Subtitle', nullable: true })
  @Column({
    length: 50,
    nullable: true,
  })
  subtitle?: string;

  @IsOptional()
  @ApiProperty({ example: 'description', nullable: true })
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
