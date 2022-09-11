import { Body, Controller, HttpCode, HttpStatus, Post, Session } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from 'src/auth/auth.service';
import { AuthTwitterService } from './auth-twitter.service';
import { AuthTwitterLoginDto } from './dtos/auth-twitter-login.dto';
import { UserAuthResponse } from '../auth/dtos/auth-response';
import { userTokenCookieKey } from '../common/constants/cookie.keys';

@ApiTags('Auth')
@Controller({
  path: 'auth/twitter',
  version: '1',
})
export class AuthTwitterController {
  constructor(
    public authService: AuthService,
    public authTwitterService: AuthTwitterService,
  ) {}

  @ApiResponse({ type: UserAuthResponse })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Session() session: Record<string, unknown>,
    @Body() loginDto: AuthTwitterLoginDto,
  ): Promise<UserAuthResponse> {
    const socialData = await this.authTwitterService.getProfileByToken(
      loginDto,
    );

    const token = await this.authService.validateSocialLogin(
      'twitter',
      socialData,
    );
    session[userTokenCookieKey] = token;
    return token;
  }
}
