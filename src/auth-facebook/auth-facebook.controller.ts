import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from 'src/auth/auth.service';
import { AuthFacebookService } from './auth-facebook.service';
import { AuthFacebookLoginDto } from './dtos/auth-facebook-login.dto';
import { UserAuthResponse } from '../auth/dtos/auth-response';

@ApiTags('Auth')
@Controller({
  path: 'auth/facebook',
  version: '1',
})
export class AuthFacebookController {
  constructor(
    public authService: AuthService,
    public authFacebookService: AuthFacebookService,
  ) {
  }

  @ApiResponse({ type: UserAuthResponse })
  @Post('login')
  @ApiOperation({ summary: 'Login using facebook' })
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: AuthFacebookLoginDto): Promise<UserAuthResponse> {
    const socialData = await this.authFacebookService.getProfileByToken(
      loginDto,
    );

    return this.authService.validateSocialLogin('facebook', socialData);
  }
}
