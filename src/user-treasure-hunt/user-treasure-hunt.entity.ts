import { Column, Entity } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { AbstractBaseEntity } from 'src/common/abstract-base-entity';
import {Exclude} from "class-transformer";

export enum UserTreasureHuntStatusEnum {
  APPROVED= 'approved',
  PENDING = 'pending',
  DISAPPROVE= 'disapprove'
}
export enum UserTreasureHuntWinningEnum {
  WON= 'won',
  PENDING = 'pending',
  LOST= 'lost'
}
@Entity('gw_user_treasure_hunts')
export class UserTreasureHuntEntity extends AbstractBaseEntity {
  @IsOptional()
  @ApiProperty({ example: 'uuid' })
  @Column({ nullable: false, type: 'uuid' })
  user_id: string;

  @IsOptional()
  @ApiProperty({ example: 'uuid' })
  @Column({ nullable: false, type: 'uuid' })
  treasure_chest_id: string;

  @Exclude()
  @IsOptional()
  @ApiProperty({ example: '000000' })
  @Column({ nullable: true, type: 'text' })
  code?: string;

  @IsOptional()
  @ApiProperty({ example: 'pending' })
  @Column({ type : "enum", enum: UserTreasureHuntStatusEnum, default: UserTreasureHuntStatusEnum.PENDING })
  status: UserTreasureHuntStatusEnum;

  @IsOptional()
  @ApiProperty({ example: 'pending' })
  @Column({ name:'win_status', type : "enum", enum: UserTreasureHuntWinningEnum, default: UserTreasureHuntWinningEnum.PENDING })
  winStatus: UserTreasureHuntWinningEnum;

  @IsOptional()
  @ApiProperty({ example: '000000' })
  @Column({ nullable: true, type: 'timestamp' })
  push_sent_at?: Date;

  @IsOptional()
  @ApiProperty({ example: '000000' })
  @Column({ nullable: true, type: 'timestamp' })
  email_sent_at?: Date;

  @IsOptional()
  @ApiProperty({ example: '000000' })
  @Column({ nullable: true, type: 'timestamp' })
  sms_sent_at?: Date;
}
