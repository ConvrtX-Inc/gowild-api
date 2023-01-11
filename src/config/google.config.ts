import { registerAs } from '@nestjs/config';

export default registerAs('google', () => ({
  clientIdIos: process.env.GOOGLE_CLIENT_ID_IOS,
  clientIdAndroid: process.env.GOOGLE_CLIENT_ID_ANDROID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,  
}));
