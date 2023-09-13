import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import { SocialInterface } from '../social/interfaces/social.interface';
import {
  AuthGoogleLoginDto,
  deviceTypeEnum,
} from './dtos/auth-google-login.dto';
import {AuthGoogleConfig} from "./google.config";

@Injectable()
export class AuthGoogleService {
  private google: OAuth2Client;

  constructor(private configService: ConfigService) {
    // this.google = new OAuth2Client(
    //   configService.get('google.clientIdIos'),
    //   configService.get('google.clientSecret'),
    //   configService.get('google.clientIdAndroid'),
    // );
  }

  async getProfileByToken(
    loginDto: AuthGoogleLoginDto,
  ): Promise<SocialInterface> {
    let ticket = undefined;
    const googleConfig = new AuthGoogleConfig(new ConfigService(),loginDto.device_type)
    console.log(loginDto)
    if (loginDto.device_type == deviceTypeEnum.IOS) {
      ticket = await googleConfig.google.verifyIdToken({
        idToken: loginDto.id_token,
        audience: [this.configService.get('google.clientIdIos')],
      });
    } else if (loginDto.device_type == deviceTypeEnum.ANDROID) {
      ticket = await googleConfig.google.verifyIdToken({
        idToken: loginDto.id_token,
        audience: [this.configService.get('google.clientIdAndroid')],
      });
    }

    const data = ticket.getPayload();

    return {
      id: data.sub,
      email: data.email,
      firstName: data.given_name,
      lastName: data.family_name,
      emailVerified: data.email_verified,
    };
  }
}
