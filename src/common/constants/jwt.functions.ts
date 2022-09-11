import { JwtFromRequestFunction } from 'passport-jwt';
import { userTokenCookieKey } from './cookie.keys';
import { TokenResponse } from '../../auth/dtos/token';
import { TokenService } from '../../auth/token.service';

export function customJwtResolver(
  tokenService: TokenService,
): JwtFromRequestFunction {
  return (req) => {
    if (req.session && req.session[userTokenCookieKey]) {
      const token = req.session[userTokenCookieKey] as TokenResponse;
      if (tokenService.verifyAccessToken(token.accessToken)) {
        return token.accessToken;
      }
    }
    return null;
  };
}
