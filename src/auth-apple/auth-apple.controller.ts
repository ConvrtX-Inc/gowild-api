import { Body, Controller, HttpCode, HttpStatus, Post, Session } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from 'src/auth/auth.service';
import { AuthAppleService } from './auth-apple.service';
import { AuthAppleLoginDto } from './dtos/auth-apple-login.dto';
import { UserAuthResponse } from '../auth/dtos/auth-response';
import { userTokenCookieKey } from '../utils/constants/cookie.keys';

@ApiTags('Auth')
@Controller({
  path: 'auth/apple',
  version: '1',
})
export class AuthAppleController {
  constructor(
    public authService: AuthService,
    public authAppleService: AuthAppleService,
  ) {
  }

  @ApiResponse({ type: UserAuthResponse })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Session() session: Record<string, unknown>,
    @Body() loginDto: AuthAppleLoginDto,
  ): Promise<UserAuthResponse> {
    const socialData = await this.authAppleService.getProfileByToken(loginDto);
    const token = await this.authService.validateSocialLogin('apple', socialData);
    session[userTokenCookieKey] = token;
    return token;
  }
}
