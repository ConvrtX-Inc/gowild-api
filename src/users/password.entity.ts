import { AbstractBaseEntity } from '../common/abstract-base-entity';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { IsOptional } from 'class-validator';
import { CrudValidationGroups } from '@nestjsx/crud';
import { UserEntity } from './user.entity';

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

  @ManyToOne(() => UserEntity, (user: UserEntity) => user.passwords)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ nullable: false, default: 'false' })
  status: string;
}
