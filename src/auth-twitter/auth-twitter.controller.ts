import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthService } from 'src/auth/auth.service';
import { AuthTwitterService } from './auth-twitter.service';
import { AuthTwitterLoginDto } from './dtos/auth-twitter-login.dto';
import { UserAuthResponse } from "../auth/dtos/auth-response";

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
  async login(@Body() loginDto: AuthTwitterLoginDto): Promise<UserAuthResponse> {
    const socialData = await this.authTwitterService.getProfileByToken(
      loginDto,
    );

    return this.authService.validateSocialLogin('twitter', socialData);
  }
}
