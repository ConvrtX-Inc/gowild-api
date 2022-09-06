import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, Validate } from 'class-validator';
import { AbstractBaseEntity } from 'src/utils/abstract-base-entity';
import { IsExist } from 'src/utils/validators/is-exists.validator';
import { Column, Entity } from 'typeorm';

@Entity('gw_route_historical_event_photos')
export class RouteHistoricalEventPhoto extends AbstractBaseEntity {
  @ApiProperty({ example: 'cbcfa8b8-3a25-4adb-a9c6-e325f0d0f3ae' })
  @Validate(IsExist, ['RouteHistoricalEvent', 'id'], {
    message: 'Route Historical Event Id not Found',
  })
  @Column({
    type: 'uuid',
    nullable: false,
  })
  route_historical_event_id?: string;

  @IsOptional()
  @ApiProperty({ example: 'Firebase img url' })
  @Column({
    type: 'text',
    nullable: true,
  })
  event_photo_url: string | null;
}
