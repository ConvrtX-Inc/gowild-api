import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { Allow, IsOptional, Validate } from "class-validator";
import { EntityHelper } from "src/utils/entity-helper";
import { IsExist } from "src/utils/validators/is-exists.validator";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class RouteHistoricalEvent extends EntityHelper{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ example: 'cbcfa8b8-3a25-4adb-a9c6-e325f0d0f3ae' })
    @Validate(IsExist, ['Route', 'id'], {
        message: 'Route Id not Found',
    })
    @Column({
        type: "uuid",
        nullable: false
    })
    route_id?: string;
    
    @IsOptional()
    @ApiProperty({ example: '830759078-477' })
    @Column({
        length: 50,
        nullable: true    
    })
    closure_uid?: string;

    @IsOptional()
    @ApiProperty({ example: 32.4832})
    @Column({
        type: 'decimal',
        precision: 8,
        scale: 4,
        nullable: true  
    })
    event_long?: number;

    @IsOptional()
    @ApiProperty({ example: 42.1437})
    @Column({
        type: 'decimal',
        precision: 8,
        scale: 4,
        nullable: true  
    })
    event_lat?: number;

    @IsOptional()
    @ApiProperty({ example: 'First On the List' })
    @Column({
        length: 50,
        nullable: true    
    })
    event_title?: string;

    @IsOptional()
    @ApiProperty({ example: 'Subtitle' })
    @Column({
        length: 50,
        nullable: true    
    })
    event_subtitle?: string;

    @IsOptional()
    @ApiProperty({ example: 'description' })
    @Column({ nullable: true })
    description?: string;

    @CreateDateColumn()
    created_date: Date;

    @UpdateDateColumn()
    updated_date: Date;
}
