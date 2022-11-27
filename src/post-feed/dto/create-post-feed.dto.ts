import {ApiProperty} from "@nestjs/swagger";
import {IsBoolean, IsString} from "class-validator";
import {Transform} from "class-transformer";

export class CreatePostFeedDto {
    @ApiProperty({ nullable: false })
    @IsString()
    title: string;

    @ApiProperty({ nullable: false })
    @IsString()
    description: string;

    @ApiProperty({ example: 'byte64image', nullable: true })
    @Transform((value: Buffer | null | string) => (value == null ? '' : value))
    img: Buffer | null | string;

    @ApiProperty({ example: false, nullable: false })
    @IsBoolean()
    is_published: boolean;

}
