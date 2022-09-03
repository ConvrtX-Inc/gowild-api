import { ApiProperty } from "@nestjs/swagger";

export class AuthRefreshTokenDto {
  @ApiProperty()
  refreshToken: string;
}
