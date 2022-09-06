import { AccessToken } from './src/auth/dtos/token';

export {};

declare global {
  namespace Express {
    interface User extends AccessToken {
      iat: number;
      exp: number;
      sub: string;
    }
  }
}
