import { ApiProperty } from '@nestjs/swagger';
import { Allow, IsOptional } from 'class-validator';
import { AbstractBaseEntity } from 'src/common/abstract-base-entity';
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne
} from 'typeorm';
import { Route } from './route.entity';

export enum SavedRoutesStatusEnum {
    CANCELLED = 'cancelled',
    PENDING = 'pending',
    COMPLETED = 'completed'
}

@Entity('gw_saved-routes')
export class SavedRoute extends AbstractBaseEntity {

    @ApiProperty({ example: 'cbcfa8b8-3a25-4adb-a9c6-e325f0d0f3ae' })
    @Column({
        type: 'uuid',
        nullable: false,
    })
    user_id?: string;


    @ApiProperty({ example: 'cbcfa8b8-3a25-4adb-a9c6-e325f0d0f3ae' })
    @ManyToOne(() => Route, { nullable: false, cascade: false, eager: true })
    @JoinColumn({ name: 'route_id' })
    @Column({
        type: 'uuid',
        nullable: false,
    })
    route_id?: string;

    @IsOptional()
    @ApiProperty({ example: 'pending' })
    @Column({ type: "enum", enum: SavedRoutesStatusEnum, default: SavedRoutesStatusEnum.PENDING })
    status: SavedRoutesStatusEnum;
}
