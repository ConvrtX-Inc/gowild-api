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
export class GuidelineLog extends EntityHelper {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ example: 'd0db6de5-c0b0-450c-a56a-492ee9ed3a7b'})
    @Validate(IsExist, ['User', 'id'], {
        message: 'User Not Found',
    })
    @Column({
        type: "uuid",
        nullable: false
    })
    user_id?: string;

    @IsOptional()
    @ApiProperty({ example: 'description' })
    @Column({ nullable: true, type: 'text' })
    guideline_type?: string;

    @IsOptional()
    @ApiProperty({ example: '2022-01-01 11:11:11' })
    @Column({ type: 'timestamp' })
    last_updateDate?: Date;

    @CreateDateColumn({ name: 'create_date' })
    createDate: Date;

    @UpdateDateColumn({ name: 'updated_date' })
    updatedDate: Date;
}
