import { Column, Entity, Index, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';
import { Allow } from 'class-validator';
import { AbstractBaseEntity } from 'src/utils/abstract-base-entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('gw_forgot_passwords')
export class Forgot extends AbstractBaseEntity {
  @ApiProperty({ nullable: true })
  @Allow()
  @Column()
  @Index()
  hash: string;

  @Allow()
  @ApiProperty({ nullable: true })
  @ManyToOne(() => User, {
    eager: true,
  })
  user: User;
}
