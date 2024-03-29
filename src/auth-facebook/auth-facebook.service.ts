import { Injectable } from '@nestjs/common';
import { Facebook } from 'fb';
import { ConfigService } from '@nestjs/config';
import { SocialInterface } from '../social/interfaces/social.interface';
import { FacebookInterface } from './interfaces/facebook.interface';
import { AuthFacebookLoginDto } from './dtos/auth-facebook-login.dto';

@Injectable()
export class AuthFacebookService {
  private fb;

  constructor(private configService: ConfigService) {
    this.fb = new Facebook({
      appId: configService.get('facebook.appId'),
      appSecret: configService.get('facebook.appSecret'),
      version: 'v7.0',
    });
  }

  async getProfileByToken(
    loginDto: AuthFacebookLoginDto,
  ): Promise<SocialInterface> {
    this.fb.setAccessToken(loginDto.access_token);

    const data: FacebookInterface = await new Promise((resolve, reject) => {
      this.fb.api(
        '/me',
        'get',
        { fields: 'id,last_name,email,first_name' },
        (response) => {
          if (!response || response.error) {
            reject(!response ? new Error('error occurred') : response.error);
          } else {
            resolve(response);
          }
        },
      );
    });

    return {
      id: data.id,
      email: data.email,
      firstName: data.first_name,
      lastName: data.last_name,
    };
  }
}
