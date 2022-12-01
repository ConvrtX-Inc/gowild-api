import { ApiProperty } from '@nestjs/swagger';
import {
  Allow,
  IsAlphanumeric,
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  MinLength,
  IsNotEmpty,
} from 'class-validator';



export class CreateLikeDto {  
  
    @ApiProperty({ example: '54ba206c-2563-48a7-a29e-acf3ce6dc5e5' })
    @IsNotEmpty()
    postfeed_id: string;
}
