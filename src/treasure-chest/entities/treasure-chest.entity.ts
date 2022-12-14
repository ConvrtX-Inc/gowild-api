import { ApiProperty } from '@nestjs/swagger';
import { time } from 'aws-sdk/clients/frauddetector';
import { AbstractBaseEntity } from 'src/common/abstract-base-entity';
import {AfterLoad, AfterUpdate, Column, Entity} from 'typeorm';
import { Allow, IsOptional } from 'class-validator';
import appConfig from "../../config/app.config";
import {Coordinates} from "../../common/coordinates";

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
  @ApiProperty({ type: () => Coordinates, nullable: false })
  @Column({
    type: 'jsonb',
    nullable: false,
  })
  location?: Coordinates;

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
  @ApiProperty({ nullable: true })
  picture: string;

  @IsOptional()
  @ApiProperty({ example: 'augmented reality' })
  @Column({ nullable: true })
  a_r?: string;

  @AfterLoad()
  @AfterUpdate()
  updatePicture() {
    if (this.picture && this.picture.indexOf('/') === 0) {
      this.picture = appConfig().backendDomain + this.picture;
    }
  }
}
