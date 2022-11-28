import {Column, Entity, ManyToOne, PrimaryColumn} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Allow } from 'class-validator';
import { AbstractBaseEntity } from 'src/common/abstract-base-entity';
import {UserEntity} from "../users/user.entity";

@Entity('gw_user_addresses')
export class UserAddress extends AbstractBaseEntity {
  @ApiProperty({ example: 1 })
  @PrimaryColumn()
  id: string;

  @Allow()
  @ApiProperty({ example: 'Admin' })
  @Column()
  address: string;

  @Allow()
  @ApiProperty({ nullable: true })
  @ManyToOne(() => UserEntity, {
    eager: true,
  })
  user: UserEntity;
}
