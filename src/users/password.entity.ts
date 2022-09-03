import { EntityHelper } from '../utils/entity-helper';
import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { IsOptional } from 'class-validator';
import { CrudValidationGroups } from '@nestjsx/crud';
import { User } from './user.entity';

@Index('idx_password_user_by_status', (obj: Password) => [obj.user])
@Entity('passwords')
export class Password extends EntityHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @IsOptional({ groups: [CrudValidationGroups.UPDATE] })
  @Column({ nullable: false })
  hashedValue: string;

  @Column({ nullable: false })
  algoritm: string;

  @Column({ nullable: true, type: 'text' })
  metaData: string;

  @ManyToOne(() => User, (user: User) => user.passwords)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ nullable: false, default: 'false' })
  status: string;
}
