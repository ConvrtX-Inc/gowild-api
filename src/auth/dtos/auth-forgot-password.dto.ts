import { ApiProperty } from '@nestjs/swagger';
import {IsEmail, IsOptional} from 'class-validator';
import { Transform } from 'class-transformer';

export class AuthForgotPasswordDto {
  @ApiProperty()
  @IsOptional()
  @Transform((value: string) => value.toLowerCase().trim())
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsOptional()
  @Transform((value: string) => value.toLowerCase().trim())
  phone: string;
}
