import { ApiProperty } from '@nestjs/swagger';
import { Allow, IsOptional, Validate } from 'class-validator';
import { AbstractBaseEntity } from 'src/common/abstract-base-entity';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { Route } from '../../route/entities/route.entity';
import { Geometry } from 'geojson';
import { AppPoint } from '../../common/lat-lng.embedded';
import { FileEntity } from '../../files/file.entity';
import { IsExist } from '../../common/validators/is-exists.validator';

@Entity('gw_route_clues')
export class RouteClue extends AbstractBaseEntity {
  @ApiProperty({ example: 'cbcfa8b8-3a25-4adb-a9c6-e325f0d0f3ae' })
  @Validate(IsExist, ['Route', 'id'], {
    message: 'Route not Found',
  })
  @Column({
    type: 'uuid',
    nullable: false,
  })
  route_id?: string;

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
    nullable: true,
  })
  title?: string;

  @IsOptional()
  @ApiProperty({ example: 'message' })
  @Column({ nullable: true })
  description?: string;

  @Allow()
  @ApiProperty({ nullable: true, type: [FileEntity] })
  @ManyToMany(() => FileEntity)
  @JoinTable({ name: 'gw_route_clue_medias' })
  medias: FileEntity[];

  @IsOptional()
  @ApiProperty({ example: 'augmented reality' })
  @Column({ nullable: true })
  ar_clue?: string;
}
