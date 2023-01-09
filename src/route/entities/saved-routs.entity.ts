import { ApiProperty } from '@nestjs/swagger';
import { Allow, IsOptional } from 'class-validator';
import { AbstractBaseEntity } from 'src/common/abstract-base-entity';
import { Column, Entity } from 'typeorm';

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
    @Column({
        type: 'uuid',
        nullable: false,
    })
    treasure_chest_id?: string;

    @IsOptional()
    @ApiProperty({ example: 'pending' })
    @Column({ type : "enum", enum: SavedRoutesStatusEnum, default: SavedRoutesStatusEnum.PENDING })
    status: SavedRoutesStatusEnum;
}
