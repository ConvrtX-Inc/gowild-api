import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty, IsOptional} from "class-validator";
import { time } from "aws-sdk/clients/frauddetector";
import { IsValidTime } from "src/common/is_valid_time";
import {Coordinates} from "../../common/coordinates";

export class CreateRouteDto {
    @ApiProperty({ example: 'John' })
    @IsNotEmpty()
    title: string;

    @ApiProperty({ example: 'Doe' })
    @IsOptional()
    @IsNotEmpty()
    description?: string;

    @ApiProperty({ nullable: false })
    @IsNotEmpty()
    start: Coordinates;

    @ApiProperty({ nullable: false })
    @IsNotEmpty()
    end: Coordinates;

    @ApiProperty({ type: 'string', nullable: false })
    @IsNotEmpty()
    distance_miles: string;

    @ApiProperty({ type: 'string', nullable: false })
    @IsNotEmpty()
    distance_meters: string;

    @ApiProperty({ example: '01:04:55' })
    @IsNotEmpty()
    @IsValidTime({ message: 'Completion time must be a valid time string (HH:mm:ss)' })
    estimate_time: time;
    

    

}
