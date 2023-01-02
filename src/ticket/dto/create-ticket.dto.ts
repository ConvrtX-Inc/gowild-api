import {ApiProperty} from "@nestjs/swagger";
import {IsOptional} from "class-validator";
import {Column} from "typeorm";

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

}

