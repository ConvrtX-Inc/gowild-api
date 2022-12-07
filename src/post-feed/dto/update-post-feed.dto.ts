import {ApiProperty, PartialType} from '@nestjs/swagger';
import {IsBoolean, IsString} from "class-validator";
import {Transform} from "class-transformer";

export class UpdatePostFeedDto {
    @ApiProperty({ nullable: true })
    @IsString()
    title: string;

    @ApiProperty({ nullable: true })
    @IsString()
    description: string;

    @ApiProperty({ example: false, nullable: true })
    @IsBoolean()
    is_published: boolean;
}
