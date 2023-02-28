import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsPhoneNumber } from 'class-validator';

export class SendVerificationTokenDto {
  @ApiProperty({ example: '+639506703405' })
  // @Transform((value: string) =>
  //   value.toLowerCase().trim().charAt(1) != '+'
  //     ? '+' + value.toLowerCase().trim().charAt(1)
  //     : value.toLowerCase().trim().charAt(1),
  // )
  //@IsPhoneNumber()
  emailPhone: string;
}
