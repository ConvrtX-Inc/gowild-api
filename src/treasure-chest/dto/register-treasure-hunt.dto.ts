import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty, IsOptional} from "class-validator";

export class RegisterTreasureHuntDto {

    @ApiProperty({ example: '54ba206c-2563-48a7-a29e-acf3ce6dc5e5' })    
    @IsNotEmpty()
    treasure_chest_id?: string;

}
