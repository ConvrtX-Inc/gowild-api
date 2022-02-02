import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class AuthGoogleLoginDto {
  @ApiProperty({ example: 'abc' })
  @IsNotEmpty()
  id_token: string;
}
