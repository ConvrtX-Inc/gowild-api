import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { AuthConfig } from '../dtos/auth.config';
import { customJwtResolver } from '../../common/constants/jwt.functions';
import { TokenService } from '../token.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    tokenService: TokenService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        customJwtResolver(tokenService),
      ]),
      secretOrKey: configService.get<AuthConfig>('auth').accessToken.secret,
    });
  }

  public validate(payload: Express.User) {
    return payload;
  }
}
