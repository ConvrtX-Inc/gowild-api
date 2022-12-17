import {IsNotEmpty, IsOptional} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";
import {Column} from "typeorm";
import { GuidelineTypesEnum } from "../guideline.enum";


export class CreateGuidelineDto{

    @ApiProperty({example : " termsAndConditions, faq , eWaiver , huntEWaiver "})
    @IsNotEmpty()
    type: GuidelineTypesEnum 

    @ApiProperty({example:"string"})
    @IsNotEmpty()
    description: string;
}