import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateSponsorDto {
    @ApiProperty({ example: '54ba206c-2563-48a7-a29e-acf3ce6dc5e5', nullable: false})
    @IsNotEmpty()
    treasure_chest_id: string;

    @ApiProperty({ type: 'string', example: 'www.redbull.com', nullable: true })
    @IsOptional()
    img_url: string;

    @ApiProperty({ type: 'string', nullable: true })
    img: string | null;

    @ApiProperty({ type: 'string', nullable: false })
    @IsNotEmpty()
    link: string;

}
