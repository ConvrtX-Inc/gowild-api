import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class AuthResetPasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  hash: string;

  @ApiProperty()
  @IsNotEmpty()
  emailPhone: string;
}

export class AuthResetPasswordAdminDto {
  @ApiProperty()
  @IsOptional()
  password: string;
}
