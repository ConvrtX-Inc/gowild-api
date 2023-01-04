import {IsOptional} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";
import {Column} from "typeorm";

export class CreateTicketMessageDto {

    @IsOptional()
    @ApiProperty({ example: 'Description' })
    @Column({ type: 'text' })
    message?: string;
}
