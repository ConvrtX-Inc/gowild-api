import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Request,
  Post,
  UseGuards,
  Patch,
  Delete,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import {ApiBearerAuth, ApiOperation, ApiTags} from '@nestjs/swagger';
import { AuthEmailLoginDto } from './dtos/auth-email-login.dto';
import { AuthForgotPasswordDto } from './dtos/auth-forgot-password.dto';
import {AuthResetPasswordAdminDto, AuthResetPasswordDto} from './dtos/auth-reset-password.dto';
import { AuthRegisterLoginDto } from './dtos/auth-register-login.dto';

@ApiTags('Auth')
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(public service: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login account' })
  public async login(@Body() loginDto: AuthEmailLoginDto) {
    return this.service.validateLogin(loginDto);
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register new account' })
  async register(@Body() createUserDto: AuthRegisterLoginDto) {
    return this.service.register(createUserDto);
  }

  @Post('forgot/password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request forgot password' })
  async forgotPassword(@Body() forgotPasswordDto: AuthForgotPasswordDto) {
    return this.service.forgotPassword(forgotPasswordDto);
  }

  @Post('reset/password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset user password' })
  async resetPassword(@Body() resetPasswordDto: AuthResetPasswordDto) {
    return this.service.resetPassword(
      resetPasswordDto.hash,
      resetPasswordDto.password,
    );
  }

  @Get('generate-admin')
  @ApiOperation({ summary: 'Generates default admin' })
  @HttpCode(HttpStatus.OK)
  public async generateAdmin() {
    return this.service.generateAdmin();
  }

  @Post('reset-admin-password')
  @ApiOperation({ summary: 'Reset password for default admin' })
  public async resetAdminPassword(@Body() dto: AuthResetPasswordAdminDto) {
    return this.service.resetAdminPassword(dto);
  }

  @ApiBearerAuth()
  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  public async me(@Request() request) {
    return this.service.me(request.user);
  }
}