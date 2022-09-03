import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, Validate } from "class-validator";
import { EntityHelper } from "src/utils/entity-helper";
import { IsExist } from "src/utils/validators/is-exists.validator";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Ticket extends EntityHelper {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ example: 'cbcfa8b8-3a25-4adb-a9c6-e325f0d0f3ae' })
    @Validate(IsExist, ['User', 'id'], {
        message: 'User Id not Found',
    })
    @Column({
        type: "uuid",
        nullable: false
    })
    user_id?: string;

    @IsOptional()
    @ApiProperty({ example: 'Uploading of Attachment' })
    @Column({
        length: 50,
        nullable: true
    })
    subject?: string;

    @IsOptional()
    @ApiProperty({ example: 'Description' })
    @Column({ type: 'text' })
    message?: string;

    @IsOptional()
    @ApiProperty({ example: 'Firebase img url' })
    @Column({
      type: 'text',
      nullable: true,
    })
    img_url: string | null;

    @IsOptional()
    @ApiProperty({ example: '0'})
    @Column({
        type: 'integer',
        nullable: false
    })
    status?: number

    @CreateDateColumn({ name: 'create_date' })
    createDate: Date;

    @UpdateDateColumn({ name: 'updated_date' })
    updatedDate: Date;
}
