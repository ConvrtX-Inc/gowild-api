import {
    Column,
    CreateDateColumn,    
    Entity,    
    PrimaryGeneratedColumn,
    UpdateDateColumn,
  } from 'typeorm';
  import { ApiProperty } from '@nestjs/swagger';
  import { IsOptional, Validate } from 'class-validator';
  import { EntityHelper } from 'src/utils/entity-helper';  
  import { IsExist } from 'src/utils/validators/is-exists.validator';
    
  @Entity()
  export class Participant extends EntityHelper {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @IsOptional()
    @ApiProperty({ example: 'cbcfa8b8-3a25-4adb-a9c6-e325f0d0f3ae' })
    @Validate(IsExist, ['User', 'id'], {
      message: 'User not Found',
    })
    @Column({ nullable: true })
    user_id?: string | null;

    @IsOptional()
    @ApiProperty({ example: 'cbcfa8b8-3a25-4adb-a9c6-e325f0d0f3ae' })
    @Validate(IsExist, ['Room', 'id'], {
      message: 'Room not Found',
    })
    @Column({ nullable: true })
    room_id?: string | null;
          
    @CreateDateColumn()
    created_date: Date;
    
    @UpdateDateColumn()
    updated_date: Date;
        
    }
    