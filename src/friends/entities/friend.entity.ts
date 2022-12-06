import { ApiProperty } from '@nestjs/swagger';
import { Allow, Validate , IsOptional} from 'class-validator';
import { AbstractBaseEntity } from 'src/common/abstract-base-entity';
import { IsExist } from 'src/common/validators/is-exists.validator';
import { Column, Entity, PrimaryGeneratedColumn , CreateDateColumn , UpdateDateColumn , DeleteDateColumn} from 'typeorm';

@Entity('gw_friends')
export class Friends extends AbstractBaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @IsOptional()
  @ApiProperty({ example: '9d8e6d30-7b9a-44a1-8f96-a6be1dcd6f9d' })
  @Validate(IsExist, ['User', 'id'], {
    message: 'from_user_id User not Found',
  })
  @Column({ nullable: true })
  from_user_id?: string | null;

  from_user: any;

  to_user: any;

  @IsOptional()
  @ApiProperty({ example: '9d8e6d30-7b9a-44a1-8f96-a6be1dcd6f9d' })
  @Validate(IsExist, ['User', 'id'], {
    message: 'to_user_id User not Found',
  })
  @Column({ nullable: true })
  to_user_id?: string | null;

  @IsOptional()
  @ApiProperty({ example: true })
  @Column({ type: 'boolean', nullable: true, default: 'FALSE' })
  is_accepted: boolean | null;

  @CreateDateColumn()
  created_date: Date;

  @DeleteDateColumn()
  deleted_date: Date;
}
