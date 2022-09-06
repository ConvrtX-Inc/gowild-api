import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, ValidateIf } from 'class-validator';
import { Transform } from 'class-transformer';

export class AuthForgotPasswordDto {
  @ApiProperty({ nullable: true })
  @IsOptional()
  @Transform((value: string) => value.toLowerCase().trim())
  @IsEmail()
  email: string;

  @ValidateIf((o: AuthForgotPasswordDto) => !o.email)
  @ApiProperty({ nullable: true })
  @IsNotEmpty()
  @IsPhoneNumber()
  @IsOptional()
  @Transform((value: string) => value.toLowerCase().trim())
  phone: string;
}
