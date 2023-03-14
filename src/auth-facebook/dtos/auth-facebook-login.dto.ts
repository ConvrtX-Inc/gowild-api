import { ApiProperty } from '@nestjs/swagger';
import {IsNotEmpty, IsOptional} from 'class-validator';

export class AuthFacebookLoginDto {
  @ApiProperty({ example: 'abc' })
  @IsNotEmpty()
  access_token: string;
  @ApiProperty({ example: 'fcm_token' })
  @IsOptional()
  fcm_token: string;
}
