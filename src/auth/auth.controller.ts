import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthEmailLoginDto } from './dtos/auth-email-login.dto';
import { AuthForgotPasswordDto } from './dtos/auth-forgot-password.dto';
import { AuthResetPasswordAdminDto, AuthResetPasswordDto } from './dtos/auth-reset-password.dto';
import { AuthRegisterLoginDto } from './dtos/auth-register-login.dto';
import { UserAuthResponse } from './dtos/auth-response';
import { TokenResponse } from './dtos/token';
import { AuthRefreshTokenDto } from './dtos/auth-refresh-token.dto';
import { User } from '../users/user.entity';

@ApiTags('Auth')
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(public service: AuthService) {
  }

  @ApiResponse({ type: UserAuthResponse })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login account' })
  public async login(
    @Body() loginDto: AuthEmailLoginDto,
  ): Promise<UserAuthResponse> {
    return this.service.validateLogin(loginDto);
  }

  @ApiResponse({ type: User })
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register new account' })
  async register(
    @Body() createUserDto: AuthRegisterLoginDto,
  ): Promise<User> {
    return this.service.register(createUserDto);
  }

  @Post('forgot/password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request forgot password' })
  async forgotPassword(
    @Body() forgotPasswordDto: AuthForgotPasswordDto,
  ): Promise<void> {
    return this.service.forgotPassword(forgotPasswordDto);
  }

  @Post('reset/password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset user password' })
  async resetPassword(
    @Body() resetPasswordDto: AuthResetPasswordDto,
  ): Promise<void> {
    return this.service.resetPassword(
      resetPasswordDto.hash,
      resetPasswordDto.password,
    );
  }

  @ApiResponse({ type: User })
  @Get('generate-admin')
  @ApiOperation({ summary: 'Generates default admin' })
  @HttpCode(HttpStatus.OK)
  public async generateAdmin(): Promise<User> {
    return this.service.generateAdmin();
  }

  @ApiResponse({ type: User })
  @Post('reset-admin-password')
  @ApiOperation({ summary: 'Reset password for default admin' })
  public async resetAdminPassword(
    @Body() dto: AuthResetPasswordAdminDto,
  ): Promise<User> {
    return this.service.resetAdminPassword(dto);
  }

  @ApiResponse({ type: User })
  @ApiBearerAuth()
  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  public async me(@Request() request: Express.Request): Promise<User> {
    return this.service.me(request.user?.id);
  }

  @ApiOperation({ summary: 'Refresh token using a previous RefreshToken' })
  @ApiResponse({ type: TokenResponse, description: 'Token object' })
  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  public async refreshToken(
    @Body() dto: AuthRefreshTokenDto,
  ): Promise<TokenResponse> {
    return this.service.refreshToken(dto);
  }
}
