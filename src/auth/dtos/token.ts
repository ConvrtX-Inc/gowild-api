export class TokenResponse {
  token: string;
  refreshToken: string;
}

export interface SimpleUser {
  firstName: string | null;
  lastName: string | null;
  birthDate: Date | null;
  gender: string | null;
  username: string | null;
  phoneNo: string | null;
  uid: string;
  email: string | null;
  fullName: string | null;
}

export type TokenType = 'accessToken' | 'refreshToken';

export interface IToken {
  user: SimpleUser;
  email: string | null;

  type(): TokenType;
}

export class RefreshToken implements IToken {
  rid: string;
  user: SimpleUser;
  email: string | null;

  type(): TokenType {
    return 'refreshToken';
  }
}

export class AccessToken implements IToken {
  user: SimpleUser;
  email: string | null;

  type(): TokenType {
    return 'accessToken';
  }
}
