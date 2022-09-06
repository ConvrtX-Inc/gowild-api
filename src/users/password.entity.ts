import { AbstractBaseEntity } from '../utils/abstract-base-entity';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { IsOptional } from 'class-validator';
import { CrudValidationGroups } from '@nestjsx/crud';
import { User } from './user.entity';

@Index('idx_password_user_by_status', (obj: Password) => [obj.user])
@Entity('gw_user_passwords')
export class Password extends AbstractBaseEntity {
  @IsOptional({ groups: [CrudValidationGroups.UPDATE] })
  @Column({ nullable: false })
  hashedValue: string;

  @Column({ nullable: false })
  algorithm: string;

  @Column({ nullable: true, type: 'text' })
  metaData: string;

  @ManyToOne(() => User, (user: User) => user.passwords)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ nullable: false, default: 'false' })
  status: string;
}
