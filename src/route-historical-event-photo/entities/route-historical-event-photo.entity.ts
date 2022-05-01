import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, Validate } from "class-validator";
import { EntityHelper } from "src/utils/entity-helper";
import { IsExist } from "src/utils/validators/is-exists.validator";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class RouteHistoricalEventPhoto extends EntityHelper {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ example: 'cbcfa8b8-3a25-4adb-a9c6-e325f0d0f3ae' })
    @Validate(IsExist, ['RouteHistoricalEvent', 'id'], {
        message: 'Route Historical Event Id not Found',
    })
    @Column({
        type: "uuid",
        nullable: false
    })
    route_historical_event_id?: string;

    @IsOptional()
    @ApiProperty({ example: 'Firebase img url' })
    @Column({
      type: 'text',
      nullable: true,
    })
    event_photo_url: string | null;

    @CreateDateColumn()
    created_date: Date;

    @UpdateDateColumn()
    updated_date: Date;
}
