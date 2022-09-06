import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { Allow, IsOptional, Validate } from 'class-validator';
import { AbstractBaseEntity } from 'src/utils/abstract-base-entity';
import { IsExist } from 'src/utils/validators/is-exists.validator';
import { Column, Entity } from 'typeorm';

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
  @ApiProperty({ example: 32.4832 })
  @Column({
    type: 'decimal',
    precision: 8,
    scale: 4,
    nullable: true,
  })
  location_point_long?: number;

  @IsOptional()
  @ApiProperty({ example: 32.4832 })
  @Column({
    type: 'decimal',
    precision: 8,
    scale: 4,
    nullable: true,
  })
  location_point_lat?: number;

  @IsOptional()
  @ApiProperty({ example: 32.4832 })
  @Column({
    type: 'decimal',
    precision: 8,
    scale: 4,
    nullable: true,
  })
  clue_point_long?: number;

  @IsOptional()
  @ApiProperty({ example: 32.4832 })
  @Column({
    type: 'decimal',
    precision: 8,
    scale: 4,
    nullable: true,
  })
  clue_point_lat?: number;

  @IsOptional()
  @ApiProperty({ example: 'First On the List' })
  @Column({
    length: 50,
    nullable: true,
  })
  clue_title?: string;

  @IsOptional()
  @ApiProperty({ example: 'message' })
  @Column({ nullable: true })
  description?: string;

  @Allow()
  @IsOptional()
  @ApiProperty({ example: 'byte64image' })
  @Transform((value: Buffer | null | string) => (value == null ? '' : value))
  @Column({
    name: 'clue_img',
    type: 'bytea',
    nullable: true,
  })
  clue_img?: Buffer | null | string;

  @IsOptional()
  @ApiProperty({ example: 'video' })
  @Column({ nullable: true })
  video_url?: string;

  @IsOptional()
  @ApiProperty({ example: 'augmented reality' })
  @Column({ nullable: true })
  ar_clue?: string;
}
