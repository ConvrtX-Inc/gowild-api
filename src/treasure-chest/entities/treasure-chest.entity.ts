import { ApiProperty } from '@nestjs/swagger';
import { time } from 'aws-sdk/clients/frauddetector';
import { AbstractBaseEntity } from 'src/common/abstract-base-entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Allow, IsOptional } from 'class-validator';
import { AppPoint } from '../../common/lat-lng.embedded';
import { Geometry } from 'geojson';
import { FileEntity } from '../../files/file.entity';

export enum TreasureChestStatusEnum {
  CANCELLED= 'cancelled',
  PENDING = 'pending',
  COMPLETED= 'completed'
}
@Entity('gw_treasure_chests')
export class TreasureChest extends AbstractBaseEntity {
  @IsOptional()
  @ApiProperty({ example: 'First On The List' })
  @Column({
    length: 50,
    nullable: false,
  })
  title?: string;

  @IsOptional()
  @ApiProperty({ example: 'Lorem ipsum' })
  @Column({ nullable: false })
  description?: string;

  @Allow()
  @ApiProperty({ type: () => AppPoint })
  @Column({
    type: 'geometry',
    nullable: true,
  })
  location?: Geometry;

  @IsOptional()
  @ApiProperty({ example: '2021/12/31' })
  @Column({ nullable: false, name: 'event_date' })
  eventDate: Date;

  @IsOptional()
  @ApiProperty({ example: '07:04' })
  @Column({ nullable: false, name: 'event_time' })
  eventTime: time;

  @IsOptional()
  @ApiProperty({ example: 'pending' })
  @Column({ type : "enum", enum: TreasureChestStatusEnum, default: TreasureChestStatusEnum.PENDING })
  status: TreasureChestStatusEnum;

  @IsOptional()
  @ApiProperty({ example: 200 })
  @Column({
    type: 'integer',
    nullable: false,
  })
  no_of_participants?: number;

  @IsOptional()
  @ApiProperty({ example: 'uuid' })
  @Column({ nullable: false ,type: 'uuid',name: 'winner_id' })
  winnerId?: string;

  @Allow()
  @ApiProperty({ nullable: true, type: () => FileEntity })
  @ManyToOne(() => FileEntity, { nullable: true, cascade: false, eager: true })
  @JoinColumn({ name: 'picture_id' })
  picture: FileEntity;

  @IsOptional()
  @ApiProperty({ example: 'augmented reality' })
  @Column({ nullable: true })
  a_r?: string;
}
