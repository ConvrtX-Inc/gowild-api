import { ApiProperty } from '@nestjs/swagger';
import { Allow, IsOptional, Validate } from 'class-validator';
import { AbstractBaseEntity } from 'src/common/abstract-base-entity';
import { IsExist } from 'src/common/validators/is-exists.validator';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
} from 'typeorm';
import { Route } from '../../route/entities/route.entity';
import { RouteHistoricalEvent } from './route-historical-event.entity';

@Entity('gw_route_historical_event_medias')
export class RouteHistoricalEventMedias extends AbstractBaseEntity {
  @Allow()
  @ApiProperty({ nullable: true, type: () => RouteHistoricalEventMedias })
  @Column({ nullable: true })
  picture: string;

  @ManyToOne(
    () => RouteHistoricalEvent,
    (RouteHistoricalEvent: RouteHistoricalEvent) => RouteHistoricalEvent.medias,
  )
  @JoinColumn({ name: 'routeHistoricalEvent_id' })
  routeHistoricalEvent: RouteHistoricalEvent;
}
