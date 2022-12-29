import {Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, Validate } from 'class-validator';
import { AbstractBaseEntity } from 'src/common/abstract-base-entity';
import { IsExist } from 'src/common/validators/is-exists.validator';
import {Room} from "../room/room.entity";

@Entity('gw_participants')
export class Participant extends AbstractBaseEntity {
  @IsOptional()
  @ApiProperty({ example: 'cbcfa8b8-3a25-4adb-a9c6-e325f0d0f3ae' })
  @Validate(IsExist, ['UserEntity', 'id'], {
    message: 'User not Found',
  })
  @Column({ type: 'uuid',
    nullable: false, })
  user_id?: string;

  @IsOptional()
  @ApiProperty({ example: 'cbcfa8b8-3a25-4adb-a9c6-e325f0d0f3ae' })
  @Validate(IsExist, ['Room', 'id'], {
    message: 'Room not Found',
  })
  // @Column({ nullable: true })
  // room_id?: string | null;

  @ApiProperty({ nullable: true })
  @ManyToOne(() => Room, (room) => room.participant)
  @JoinColumn({ name: "room_id" })
  room: Room
}
