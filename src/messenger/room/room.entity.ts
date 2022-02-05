import {
  Column,
  CreateDateColumn,    
  Entity,    
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { EntityHelper } from 'src/utils/entity-helper';  
  
@Entity()
export class Room extends EntityHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  
  @IsOptional()
  @ApiProperty({ example: 'name' })
  @Column({ length: 100 })
  name?: string;

  @IsOptional()
  @ApiProperty({ example: 'type' })
  @Column({ length: 100 })
  type?: string;
    
  @CreateDateColumn()
  created_date: Date;
  
  @UpdateDateColumn()
  updated_date: Date;
      
  }
  