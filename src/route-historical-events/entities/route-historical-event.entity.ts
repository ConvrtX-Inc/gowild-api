import { ApiProperty } from '@nestjs/swagger';
import { Allow, IsOptional } from 'class-validator';
import { AbstractBaseEntity } from 'src/common/abstract-base-entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Route } from '../../route/entities/route.entity';
import { FileEntity } from '../../files/file.entity';
import { RouteHistoricalEventMedias } from './route-historical-event-medias.entity';
import {Coordinates} from "../../common/coordinates";

@Entity('gw_route_historical_events')
export class RouteHistoricalEvent extends AbstractBaseEntity {
  @Allow()
  @ApiProperty({ nullable: true, type: () => Route })
  @ManyToOne(() => Route, {
    nullable: true,
    cascade: false,
    eager: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'route_id' })
  route: Route;

  @Allow()
  @ApiProperty({ type: () => Coordinates, nullable: false })
  @Column({
    type: 'jsonb',
    nullable: false,
  })
  historical_event: Coordinates;

/*  @IsOptional()
  @ApiProperty({ example: '830759078-477', nullable: true })
  @Column({
    length: 50,
    nullable: true,
  })
  closureUid?: string;*/

  /*@IsOptional()
  @Allow()
  @ApiProperty({ type: () => AppPoint, nullable: true })
  @Column({
    type: 'geometry',
    nullable: true,
  })
  point?: Geometry;*/

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
  @Column({nullable:true})
  image: string;

 
 @OneToMany(() => RouteHistoricalEventMedias, (medias) => medias.routeHistoricalEvent, { cascade: ['remove'] })
  medias: RouteHistoricalEventMedias[];

}
