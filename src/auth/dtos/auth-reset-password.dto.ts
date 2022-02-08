import { ApiProperty } from '@nestjs/swagger';
import {IsEmail, IsNotEmpty, IsOptional} from 'class-validator';
import {Transform} from "class-transformer";

export class AuthResetPasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  hash: string;
}

export class AuthResetPasswordAdminDto {
  @ApiProperty()
  @IsOptional()
  password: string;
}