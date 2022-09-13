import { ApiProperty } from '@nestjs/swagger';
import { Allow, IsOptional } from 'class-validator';
import { AbstractBaseEntity } from 'src/common/abstract-base-entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { FileEntity } from '../../files/file.entity';
import { RouteHistoricalEvent } from '../../route-historical-events/entities/route-historical-event.entity';
import { AppPoint } from '../../common/lat-lng.embedded';
import { Geometry } from 'geojson';
import { UserEntity } from '../../users/user.entity';

@Entity('gw_routes')
export class Route extends AbstractBaseEntity {
  @Allow()
  @ApiProperty({ nullable: true, type: () => UserEntity })
  @ManyToOne(() => UserEntity, { nullable: true, cascade: false, eager: true })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @IsOptional()
  @ApiProperty({ example: 'First On the List', nullable: true })
  @Column({
    length: 50,
    nullable: true,
  })
  title?: string;

  @Allow()
  @ApiProperty({ type: () => AppPoint, nullable: true })
  @Column({
    type: 'geometry',
    nullable: true,
  })
  start?: Geometry;

  @Allow()
  @ApiProperty({ type: () => AppPoint, nullable: true })
  @Column({
    type: 'geometry',
    nullable: true,
  })
  end?: Geometry;

  @Allow()
  @ApiProperty({ type: () => [RouteHistoricalEvent], nullable: true })
  @OneToMany(() => RouteHistoricalEvent, (obj) => obj.route, {
    cascade: true,
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
}
