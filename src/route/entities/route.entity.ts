import { ApiProperty } from "@nestjs/swagger";
import { DecimalNumber } from "aws-sdk/clients/glue";
import { Validate, IsOptional } from "class-validator";
import { EntityHelper } from "src/utils/entity-helper"
import { IsExist } from "src/utils/validators/is-exists.validator";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"

@Entity()
export class Route extends EntityHelper {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ example: 'cbcfa8b8-3a25-4adb-a9c6-e325f0d0f3ae' })
    @Validate(IsExist, ['User', 'id'], {
        message: 'User not Found',
    })
    @Column({
        type: "uuid",
        nullable: false
    })
    user_id?: string;
    
    @IsOptional()
    @ApiProperty({ example: 'First On the List' })
    @Column({
        length: 50,
        nullable: true    
    })
    route_name?: string;

    @IsOptional()
    @ApiProperty({ example: 32.4832})
    @Column({
        type: 'decimal',
        precision: 8,
        scale: 4,
        default: 0,
        nullable: true  
    })
    start_point_long?: number;
    
    @IsOptional()
    @ApiProperty({ example: 12.4233})
    @Column({
        type: 'decimal',
        precision: 8,
        scale: 4,
        default: 0,
        nullable: true
    })
    start_point_lat?: number;

    @IsOptional()
    @ApiProperty({ example: 65.5234})
    @Column({
        type: 'decimal',
        precision: 8,
        scale: 4,
        default: 0,
        nullable: true 
    })
    stop_point_long?: number;
    
    @IsOptional()
    @ApiProperty({ example: 12.4233})
    @Column({
        type: 'decimal',
        precision: 8,
        scale: 4,
        default: 0,
        nullable: true  
    })
    stop_point_lat?: number;
    
    @CreateDateColumn()
    created_date: Date;

    @UpdateDateColumn()
    updated_date: Date;
}
