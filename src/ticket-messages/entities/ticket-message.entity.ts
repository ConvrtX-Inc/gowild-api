import { ApiProperty } from "@nestjs/swagger";
import { EntityHelper } from "src/utils/entity-helper";
import { IsExist } from "src/utils/validators/is-exists.validator";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Allow, IsOptional, Validate } from "class-validator";

@Entity()
export class TicketMessage extends EntityHelper{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ example: '1235CA2B2' })
    @Validate(IsExist, ['Ticket', 'id'], {
        message: 'Ticket Id not Found',
    })
    @Column({
        type: "uuid",
        nullable: false
    })
    ticket_id?: string;

    @ApiProperty({ example: 'cbcfa8b8-3a25-4adb-a9c6-e325f0d0f3ae' })
    @Validate(IsExist, ['User', 'id'], {
        message: 'User Id not Found',
    })
    @Column({
        type: "uuid",
        nullable: false
    })
    user_id?: string;

    @CreateDateColumn()
    created_date: Date;

    @UpdateDateColumn()
    updated_date: Date;
}
