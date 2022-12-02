import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty, IsOptional} from "class-validator";
import {Coordinates} from "../entities/route.entity";

export class CreateRouteDto {
    @ApiProperty({ example: 'John' })
    @IsNotEmpty()
    title: string;

    @ApiProperty({ example: 'Doe' })
    @IsOptional()
    @IsNotEmpty()
    description?: string;

    @ApiProperty({ type: 'array', nullable: false })
    @IsNotEmpty()
    start: Coordinates;

    @ApiProperty({ type: 'boolean', nullable: false })
    @IsNotEmpty()
    saved: boolean;

    @ApiProperty({ type: 'array', nullable: false })
    @IsNotEmpty()
    end: Coordinates;

}
