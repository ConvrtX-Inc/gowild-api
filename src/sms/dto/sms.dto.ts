import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class SmsDto {
  @IsNotEmpty()
  @ApiProperty({ example: '+639506703405' })
  @Transform((value: string) => value.toLowerCase().trim())
  phone_number: string;

  @IsNotEmpty()
  @ApiProperty({ example: 'message' })
  @Transform((value: string) => value.trim())
  message: string;
}
