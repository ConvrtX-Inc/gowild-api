import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty, IsOptional} from "class-validator";
import {Coordinates} from "../../common/coordinates";
import {time} from "aws-sdk/clients/frauddetector";

export class CreateTreasureChestDto {
    @ApiProperty({ example: 'John' })
    @IsNotEmpty()
    title: string;

    @ApiProperty({ example: 'Doe' })
    @IsOptional()
    @IsNotEmpty()
    description?: string;

    @ApiProperty({ nullable: false })
    @IsNotEmpty()
    location: Coordinates;

    @ApiProperty({ nullable: false })
    @IsNotEmpty()
    eventDate: Date;

    @ApiProperty({ nullable: false })
    @IsNotEmpty()
    eventTime: time;

    @ApiProperty({ nullable: false })
    @IsNotEmpty()
    no_of_participants: number;
}
