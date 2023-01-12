import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty, IsOptional} from "class-validator";
import { time } from "aws-sdk/clients/frauddetector";
import { IsValidTime } from "src/common/is_valid_time";
import {Coordinates} from "../../common/coordinates";
import {Column} from "typeorm";
import {RouteStatusEnum} from "../entities/route.entity";
import {Exclude} from "class-transformer";

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

    @ApiProperty({ type: "number", nullable: false })
    @IsNotEmpty()
    distance_miles: number;

    @ApiProperty({ type: "number" , nullable: false })
    @IsNotEmpty()
    distance_meters: number;

    @ApiProperty({ example: '2h 14m' })
    @IsNotEmpty()
    estimate_time: string;

    @IsOptional()
    @Exclude()
    @ApiProperty({
        example: 'pending/completed',
        nullable: true,
        enum: RouteStatusEnum,
        enumName: 'RouteStatusEnum',
    })
    status: RouteStatusEnum
}
