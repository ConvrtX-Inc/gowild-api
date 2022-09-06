import { registerAs } from '@nestjs/config';
import { AuthConfig } from '../auth/dtos/auth.config';

export default registerAs(
  'auth',
  () =>
    ({
      accessToken: {
        secret: process.env.AUTH_ACCESSTOKEN_SECRET,
        expiration: process.env.AUTH_ACCESSTOKEN_EXPIRATION,
      },
      refreshToken: {
        secret: process.env.AUTH_REFRESHTOKEN_SECRET,
        expiration: process.env.AUTH_REFRESHTOKEN_EXPIRATION,
      },
    } as AuthConfig),
);
