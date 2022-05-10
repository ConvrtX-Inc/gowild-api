import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { EntityHelper } from 'src/utils/entity-helper';

@Entity()
export class Guideline extends EntityHelper {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @IsOptional()
    @ApiProperty({ example: 'waiver' })
    @Column({ unique: true, nullable: true, type: 'text' })
    type?: string;
  
    @IsOptional()
    @ApiProperty({ example: 'description' })
    @Column({ nullable: true, type: 'text' })
    description?: string;
    
    @IsOptional()
    @ApiProperty({ example: '678036c1-9da6-43ae-bb21-253a5e9b54d5' })
    @Column({ nullable: true, type: 'uuid' })
    last_updated_user?: string;
  
    @CreateDateColumn()
    created_date: Date;
  
    @UpdateDateColumn()
    updated_date: Date;
  
    @IsOptional()
    @DeleteDateColumn()
    deleted_date: Date;
  }
  
