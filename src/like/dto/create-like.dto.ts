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
  
    @ApiProperty({ example: 'uuid' })
    @IsNotEmpty()
    postfeed_id: string;
}
