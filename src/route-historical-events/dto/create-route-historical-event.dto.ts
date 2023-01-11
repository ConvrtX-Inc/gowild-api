import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty, IsOptional} from "class-validator";
import {Coordinates} from "../../common/coordinates";

export class CreateRouteHistoricalEventDto {
    @ApiProperty()
    @IsOptional()
    @IsNotEmpty()
    historical_event?: Coordinates;

    @ApiProperty({ example: 'First On the List', nullable: true })
    @IsOptional()
    @IsNotEmpty()
    title?: string;

    @ApiProperty( {example: 'Subtitle', nullable: true })
    @IsOptional()
    @IsNotEmpty()
    subtitle?: string;

    @ApiProperty({ example: 'description', nullable: true })
    @IsOptional()
    @IsNotEmpty()
    description?: string;

}
