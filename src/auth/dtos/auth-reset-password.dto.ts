import { ApiProperty } from '@nestjs/swagger';
import {IsEmail, IsNotEmpty, IsOptional} from 'class-validator';


export class AuthVerifyOTPDto { 
  @ApiProperty()
  @IsNotEmpty()
  hash: string;

  @ApiProperty()
  @IsNotEmpty()
  emailPhone: string;
}

export class AuthResetPasswordDto { 

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  emailPhone: string;

  @ApiProperty()
  @IsNotEmpty()
  hash: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;

}

export class AuthResetPasswordAdminDto {
  @ApiProperty()
  @IsOptional()
  password: string;
}
