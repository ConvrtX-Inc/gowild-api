import { ApiProperty } from '@nestjs/swagger';
import { Allow } from 'class-validator';

export class AuthRefreshTokenDto {
  @Allow()
  @ApiProperty({ nullable: false })
  refreshToken: string;
}
