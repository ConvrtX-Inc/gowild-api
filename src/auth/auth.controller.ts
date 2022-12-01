import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  Session,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthEmailLoginDto } from './dtos/auth-email-login.dto';
import { AuthForgotPasswordDto } from './dtos/auth-forgot-password.dto';
import {
  AuthResetPasswordAdminDto,
  AuthResetPasswordDto,
} from './dtos/auth-reset-password.dto';
import { AuthRegisterLoginDto } from './dtos/auth-register-login.dto';
import { TokenResponse } from './dtos/token';
import { AuthRefreshTokenDto } from './dtos/auth-refresh-token.dto';
import { UserEntity } from '../users/user.entity';
import { userTokenCookieKey } from '../common/constants/cookie.keys';
import { JwtAuthGuard } from './jwt-auth.guard';
import {AuthVerifyUserDto} from "./dtos/auth-verify-user.dto";

@ApiTags('Auth')
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(public service: AuthService) {}

  @ApiResponse({ type: TokenResponse })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login account' })
  public async login(
    @Session() session: Record<string, unknown>,
    @Body() loginDto: AuthEmailLoginDto,
  ): Promise<TokenResponse> {
    const token = await this.service.validateLogin(loginDto);
    session[userTokenCookieKey] = token;
    return token;
  }

  @ApiResponse({ type: UserEntity })
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register new account' })
  async register(
    @Body() createUserDto: AuthRegisterLoginDto,
  ): Promise<UserEntity> {
    return this.service.register(createUserDto);
  }

  @Post('forgot/password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request forgot password' })
  async forgotPassword(
    @Body() forgotPasswordDto: AuthForgotPasswordDto,) {
    return this.service.forgotPassword(forgotPasswordDto);
  }

  @Post('reset/password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset user password' })
  async resetPassword(
    @Body() resetPasswordDto: AuthResetPasswordDto,
  ): Promise<void> {
    return this.service.resetPassword(
      resetPasswordDto.emailPhone,
      resetPasswordDto.hash,
      resetPasswordDto.password,
    );
  }

  @Post('verify/mobile')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify Account' })
  async verify(
      @Body() verifyUserDto: AuthVerifyUserDto,
  ): Promise<TokenResponse> {
    return this.service.verifyOTP(verifyUserDto);
  }

  @ApiResponse({ type: UserEntity })
  @Get('generate-admin')
  @ApiOperation({ summary: 'Generates default admin' })
  @HttpCode(HttpStatus.OK)
  public async generateAdmin(): Promise<UserEntity> {
    return this.service.generateAdmin();
  }

  @ApiResponse({ type: UserEntity })
  @Post('reset-admin-password')
  @ApiOperation({ summary: 'Reset password for default admin' })
  public async resetAdminPassword(
    @Body() dto: AuthResetPasswordAdminDto,
  ): Promise<UserEntity> {
    return this.service.resetAdminPassword(dto);
  }

  @ApiResponse({ type: UserEntity })
  @ApiBearerAuth()
  @Get('me')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  public async me(@Request() request: Express.Request): Promise<UserEntity> {
    return this.service.me(request.user?.sub);
  }

  @Get('logout')
  @HttpCode(HttpStatus.OK)
  public async logout(@Request() request: Express.Request): Promise<void> {
    request.session = null;
  }

  @ApiOperation({ summary: 'Refresh token using a previous RefreshToken' })
  @ApiResponse({ type: TokenResponse, description: 'Token object' })
  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  public async refreshToken(
    @Session() session: Record<string, unknown>,
    @Body() dto: AuthRefreshTokenDto,
  ): Promise<TokenResponse> {
    let refreshToken = dto.refreshToken;
    if (!refreshToken) {
      const token = session[userTokenCookieKey] as TokenResponse;
      if (token) {
        refreshToken = token.refreshToken;
      }
    }
    if (!refreshToken) {
      throw new BadRequestException('No refresh token provided');
    }

    const token = await this.service.refreshToken(refreshToken);
    session[userTokenCookieKey] = token;
    return token;
  }
}
