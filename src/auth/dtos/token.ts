import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';

export class SimpleUser {
  @ApiProperty({ nullable: true })
  firstName: string | null;

  @ApiProperty({ nullable: true })
  lastName: string | null;

  @ApiProperty({ nullable: true })
  birthDate: Date | null;

  @ApiProperty({ nullable: true })
  gender: string | null;

  @ApiProperty({ nullable: true })
  username: string | null;

  @ApiProperty({ nullable: true })
  phoneNo: string | null;

  @ApiProperty({ nullable: true })
  email: string | null;

  @ApiProperty({ nullable: true })
  fullName: string | null;

  @ApiProperty({ nullable: true })
  picture: string | null;
}

export type TokenType = 'accessToken' | 'refreshToken';

export interface IToken {
  user: SimpleUser;
  email: string | null;
}

export class RefreshToken implements IToken {
  @ApiProperty()
  rid: string;

  @ApiProperty()
  user: SimpleUser;

  @ApiProperty()
  email: string | null;
}

export class AccessToken implements IToken {
  @ApiProperty({ type: () => SimpleUser })
  user: SimpleUser;

  @ApiProperty()
  email: string | null;
}

@ApiExtraModels(RefreshToken, AccessToken)
export class TokenResponse {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;
}
