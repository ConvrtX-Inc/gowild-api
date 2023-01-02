import {ApiProperty} from "@nestjs/swagger";
import {IsOptional, Validate} from "class-validator";
import {IsExist} from "../../common/validators/is-exists.validator";
import {Column} from "typeorm";
import {TicketStatusEnum} from "../entities/ticket.entity";

export class CreateTicketDto {

    @IsOptional()
    @ApiProperty({ example: 'Uploading of Attachment' })
    @Column({
        length: 50,
        nullable: true,
    })
    subject?: string;

    @IsOptional()
    @ApiProperty({ example: 'Description' })
    @Column({ type: 'text' })
    message?: string;

    @IsOptional()
    @ApiProperty()
    @Column({
        type: 'text',
        nullable: true,
    })
    image: string | null;

    @IsOptional()
    @ApiProperty({
        example: TicketStatusEnum.OnHold,
        nullable: true,
        enum: TicketStatusEnum,
        enumName: 'TicketStatusEnum',
    })
    @Column({ nullable: true, enum: TicketStatusEnum, enumName: 'TicketStatusEnum', default: TicketStatusEnum.Pending })
    status: TicketStatusEnum
}

