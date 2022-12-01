import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty, IsOptional} from "class-validator";

export class CreateRouteDto {
    @ApiProperty({ example: 'John' })
    @IsOptional()
    @IsNotEmpty({ message: 'mustBeNotEmpty' })
    firstName?: string;

    @ApiProperty({ example: 'Doe' })
    @IsOptional()
    @IsNotEmpty({ message: 'mustBeNotEmpty' })
    lastName?: string;
}
