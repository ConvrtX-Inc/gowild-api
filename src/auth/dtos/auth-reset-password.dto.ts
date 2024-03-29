import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

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
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  phone: string;

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
