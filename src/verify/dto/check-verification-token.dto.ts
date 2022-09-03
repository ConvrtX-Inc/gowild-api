import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsPhoneNumber } from 'class-validator';

export class CheckVerificationTokenDto {
  @ApiProperty({ example: '+639506703405' })
  @Transform((value: string) => value.toLowerCase().trim().charAt(1) != '+' ? '+' + value.toLowerCase().trim().charAt(1) : value.toLowerCase().trim().charAt(1))
  @IsPhoneNumber()
  phone_number: string;

  @ApiProperty({ example: '1212' })
  @Transform((value: string) => value.trim())
  verify_code: string;
}
