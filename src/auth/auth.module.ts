import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AnonymousStrategy } from './strategies/anonymous.strategy';
import { UsersModule } from 'src/users/users.module';
import { ForgotModule } from 'src/forgot/forgot.module';
import { MailModule } from 'src/mail/mail.module';
import { SmsModule } from 'src/sms/sms.module';
import { SocialAccountModule } from 'src/social-account/social-account.module';
import { TokenService } from './token.service';
import { AuthConfig } from './dtos/auth.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshTokenEntity } from './refresh-token.entity';
import { StatusModule } from '../statuses/status.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RefreshTokenEntity]),
    UsersModule,
    ForgotModule,
    PassportModule,
    MailModule,
    SmsModule,
    SocialAccountModule,
    StatusModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<AuthConfig>('auth').accessToken.secret,
        signOptions: {
          expiresIn: configService.get('auth.expires'),
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, AnonymousStrategy, TokenService],
  exports: [AuthService],
})
export class AuthModule {}
