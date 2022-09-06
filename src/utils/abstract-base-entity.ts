import { BaseEntity, CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class AbstractBaseEntity extends BaseEntity {
  @ApiProperty({ type: 'string', format: 'uuid' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ nullable: true })
  @CreateDateColumn({ name: 'create_date' })
  createdDate: Date;

  @ApiProperty({ nullable: true })
  @UpdateDateColumn({ name: 'updated_date' })
  updatedDate: Date;

  @Exclude()
  @ApiHideProperty()
  @DeleteDateColumn({ name: 'deleted_at' })
  deletedDate: Date;
}
