import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty, IsOptional} from "class-validator";
import { UserTreasureHuntStatusEnum } from "src/user-treasure-hunt/user-treasure-hunt.entity";

export class ChangeHuntStatusDto{
    @ApiProperty({example : "processing, disapprove"})
    @IsNotEmpty()
    status : UserTreasureHuntStatusEnum;
}

export class verifyHuntDto{

    @ApiProperty({example: "de5c7612-19a7-4d67-8f3e-a2fae10f7af6"})
    @IsNotEmpty()
    treasure_chest_id : string

    @ApiProperty({example: "000000"})
    @IsNotEmpty()
    code : string

}