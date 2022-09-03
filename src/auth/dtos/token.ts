import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';

export interface SimpleUser {
  firstName: string | null;
  lastName: string | null;
  birthDate: Date | null;
  gender: string | null;
  username: string | null;
  phoneNo: string | null;
  email: string | null;
  fullName: string | null;
}

export type TokenType = 'accessToken' | 'refreshToken';

export interface IToken {
  user: SimpleUser;
  email: string | null;
}

export class RefreshToken implements IToken {
  rid: string;
  user: SimpleUser;
  email: string | null;
}

export class AccessToken implements IToken {
  user: SimpleUser;
  email: string | null;
}

@ApiExtraModels(RefreshToken, AccessToken)
export class TokenResponse {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;
}
