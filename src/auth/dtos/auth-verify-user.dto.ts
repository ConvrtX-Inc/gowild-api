import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class AuthVerifyUserDto {
  @ApiProperty()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  phoneNo: string;

  @ApiProperty({ example: '0000' })
  @IsNotEmpty()
  otp: string;
}