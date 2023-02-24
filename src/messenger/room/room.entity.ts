import { Column, Entity, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { AbstractBaseEntity } from 'src/common/abstract-base-entity';
import { Participant } from '../participant/participant.entity';

@Entity('gw_rooms')
export class Room extends AbstractBaseEntity {
  @IsOptional()
  @ApiProperty({ example: 'name' })
  @Column({ length: 100 })
  name?: string;

  @IsOptional()
  @ApiProperty({ example: 'type' })
  @Column({ length: 100 })
  type?: string;

  @OneToMany(() => Participant, (participant) => participant.room)
  participant: Participant;
}
