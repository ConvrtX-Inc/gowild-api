import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import {
  AccessToken,
  RefreshToken,
  SimpleUser,
  TokenResponse,
  TokenType,
} from './dtos/token';
import { UserEntity } from '../users/user.entity';
import { ConfigService } from '@nestjs/config';
import { AuthConfig } from './dtos/auth.config';
import { randomUUID } from 'crypto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefreshTokenEntity } from './refresh-token.entity';
import { PasswordService } from '../users/password.service';

@Injectable()
export class TokenService {
  private readonly authConfig: AuthConfig;

  constructor(
    @InjectRepository(RefreshTokenEntity)
    private readonly tokensRepository: Repository<RefreshTokenEntity>,
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService,
    configService: ConfigService,
  ) {
    this.authConfig = configService.get<AuthConfig>('auth');
  }

  public async generateToken(user: UserEntity): Promise<TokenResponse> {
    const [accessTokenStr, refreshTokenStr] = await Promise.all([
      this.generateAccessToken(user),
      this.generateRefreshToken(user),
    ]);

    const response = new TokenResponse();
    response.refreshToken = refreshTokenStr;
    response.accessToken = accessTokenStr;
    return response;
  }

  public userIdByRefreshToken(refreshToken: string): string {
    const decoded = this.jwtService.decode(refreshToken) as RefreshToken & {
      sub: string;
    };
    if (!decoded) {
      throw new NotFoundException({
        message: 'could not decode token',
      });
    }
    return decoded.sub;
  }

  public async verifyRefreshToken(
    refreshToken: string,
  ): Promise<RefreshTokenEntity> {
    try {
      const data: RefreshToken = await this.jwtService.verifyAsync(
        refreshToken,
        {
          ...this.getConfig('refreshToken'),
        },
      );
      const refreshTokenEntity = await this.findRefreshTokenDb(data.rid);
      if (!refreshTokenEntity) {
        throw new NotFoundException('refresh token not found or already used');
      }

      const matches = await this.passwordService.compare(
        refreshToken,
        refreshTokenEntity.refreshTokenHashed,
      );
      if (!matches) {
        throw new BadRequestException('wrong refresh token');
      }

      return refreshTokenEntity;
    } catch (e) {
      Logger.error(e.message, e);
      throw new UnauthorizedException(e);
    }
  }

  public verifyAccessToken(token: string): boolean {
    try {
      this.jwtService.verify(token, {
        ...this.getConfig('accessToken'),
      });
      return true;
    } catch (e) {
      Logger.error(e.message, e);
      return false;
    }
  }

  public async invalidateRefreshToken(
    entity: RefreshTokenEntity,
  ): Promise<void> {
    entity.status = 'used';
    await this.tokensRepository.save(entity);
  }

  private async findRefreshTokenDb(
    refreshTokenId: string,
  ): Promise<RefreshTokenEntity> {
    return this.tokensRepository.findOne({
      where: { refreshTokenId, status: 'unused' },
    });
  }

  private mapUserToSimpleUser(user: UserEntity): SimpleUser {
    return {
      email: user.email,
      firstName: user.firstName,
      gender: user.gender,
      lastName: user.lastName,
      phoneNo: user.phoneNo,
      username: user.username,
      birthDate: user.birthDate,
      fullName: user.fullName,
      picture: user.picture,
      status: user.status.statusName,
      role: user.role.name
    };
  }

  private getConfig(type: TokenType): JwtSignOptions {
    return {
      secret: this.authConfig[type].secret,
      expiresIn: this.authConfig[type].expiration,
      // algorithm: 'HS256',
    };
  }

  private async generateRefreshToken(user: UserEntity): Promise<string> {
    const refreshToken: RefreshToken = {
      email: user.email,
      user: this.mapUserToSimpleUser(user),
      rid: randomUUID(),
    };
    const tokenStr = await this.jwtService.signAsync(refreshToken, {
      ...this.getConfig('refreshToken'),
      subject: user.id,
    });

    const { hash, salt } = await this.passwordService.hash(tokenStr);
    const entity = new RefreshTokenEntity();
    entity.refreshTokenId = refreshToken.rid;
    entity.refreshTokenHashed = hash;
    entity.metaData = JSON.stringify({ salt });
    entity.status = 'unused';
    await this.tokensRepository.save(entity);

    return tokenStr;
  }

  private async generateAccessToken(user: UserEntity): Promise<string> {
    const accessToken: AccessToken = {
      email: user.email,
      user: this.mapUserToSimpleUser(user),
    };
    return this.jwtService.sign(accessToken, {
      ...this.getConfig('accessToken'),
      subject: user.id,
    });
  }
}
