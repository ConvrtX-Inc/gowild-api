import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import {
  AccessToken,
  RefreshToken,
  SimpleUser,
  TokenResponse,
  TokenType,
} from '../dtos/token';
import { User } from '../../users/user';
import { randomUUID } from 'crypto';
import { ConfigService } from '@nestjs/config';
import { AuthConfig } from '../dtos/auth.config';

@Injectable()
export class TokenService {
  private readonly authConfig: AuthConfig;

  constructor(
    private readonly jwtService: JwtService,
    configService: ConfigService,
  ) {
    this.authConfig = configService.get<AuthConfig>('auth');
  }

  public async generateToken(user: User): Promise<TokenResponse> {
    const [accessTokenStr, refreshTokenStr] = await Promise.all([
      this.generateRefreshToken(user),
      this.generateAccessToken(user),
    ]);

    const response = new TokenResponse();
    response.refreshToken = refreshTokenStr;
    response.token = accessTokenStr;
    return response;
  }

  private mapUserToSimpleUser(user: User): SimpleUser {
    return {
      email: user.email,
      firstName: user.firstName,
      gender: user.gender,
      lastName: user.lastName,
      phoneNo: user.phoneNo,
      username: user.username,
      birthDate: user.birthDate,
      uid: user.id,
      fullName: user.fullName,
    };
  }

  private getConfig(type: TokenType): JwtSignOptions {
    return {
      secret: this.authConfig[type].secret,
      expiresIn: this.authConfig[type].expiration,
      algorithm: 'HS256',
    };
  }

  private async generateRefreshToken(user: User): Promise<string> {
    const refreshToken = new RefreshToken();
    refreshToken.rid = randomUUID();
    refreshToken.email = user.email;
    refreshToken.user = this.mapUserToSimpleUser(user);

    return await this.jwtService.signAsync(refreshToken, {
      ...this.getConfig('refreshToken'),
      subject: user.email,
    });
  }

  private async generateAccessToken(user: User): Promise<string> {
    const accessToken = new AccessToken();
    accessToken.email = user.email;
    accessToken.user = this.mapUserToSimpleUser(user);

    return await this.jwtService.signAsync(accessToken, {
      ...this.getConfig('accessToken'),
      subject: user.email,
    });
  }

  public userIdByRefreshToken(refreshToken: string): string {
    const decoded = this.jwtService.decode(refreshToken) as RefreshToken;
    if (!decoded) {
      throw new NotFoundException({
        message: 'could not decode token',
      });
    }
    return decoded.user.uid;
  }

  public async verifyRefreshToken(refreshToken: string): Promise<void> {
    try {
      await this.jwtService.verifyAsync(refreshToken, {
        ...this.getConfig('refreshToken'),
      });
    } catch (e) {
      throw new UnauthorizedException(e);
    }
  }
}
