import { Column, Entity, ManyToOne } from 'typeorm';
import { UserEntity } from '../users/user.entity';
import { Allow } from 'class-validator';
import { AbstractBaseEntity } from 'src/common/abstract-base-entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('gw_forgot_passwords')
export class Forgot extends AbstractBaseEntity {
  @ApiProperty({ nullable: true })
  @Allow()
  @Column()
  hash: string;

  @ApiProperty({ nullable: true })
  @Allow()
  @Column()
  emailPhone: string;
  @Allow()
  @ApiProperty({ nullable: true })
  @ManyToOne(() => UserEntity, {
    eager: true,
  })
  user: UserEntity;
}
