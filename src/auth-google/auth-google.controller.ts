import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Session,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from 'src/auth/auth.service';
import { AuthGoogleService } from './auth-google.service';
import { AuthGoogleLoginDto } from './dtos/auth-google-login.dto';
import { UserAuthResponse } from '../auth/dtos/auth-response';
import { userTokenCookieKey } from '../common/constants/cookie.keys';

@ApiTags('Auth')
@Controller({
  path: 'auth/google',
  version: '1',
})
export class AuthGoogleController {
  constructor(
    public authService: AuthService,
    public authGoogleService: AuthGoogleService,
  ) {}

  @ApiResponse({ type: UserAuthResponse })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login using google' })
  async login(
    @Session() session: Record<string, unknown>,
    @Body() loginDto: AuthGoogleLoginDto,
  ): Promise<UserAuthResponse> {
    const socialData = await this.authGoogleService.getProfileByToken(loginDto);
    const token = await this.authService.validateSocialLogin(
      'google',
      socialData,
        loginDto.fcm_token
    );
    session[userTokenCookieKey] = token;
    return token;
  }
}
