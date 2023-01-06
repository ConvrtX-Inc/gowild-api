import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty, IsOptional,Validate} from "class-validator";
import { IsExist } from "src/common/validators/is-exists.validator";

export class RegisterTreasureHuntDto {

    @ApiProperty({ example: '54ba206c-2563-48a7-a29e-acf3ce6dc5e5' })    
    @Validate(IsExist, ['TreasureChest', 'id'], {
        message: 'Treasure Chest Not Found',
    })
    @IsNotEmpty()
    treasure_chest_id?: string;

}
