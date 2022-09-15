import { registerAs } from '@nestjs/config';

export default registerAs('file', () => ({
  driver: process.env.FILE_DRIVER,
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  awsDefaultS3Bucket: process.env.AWS_DEFAULT_S3_BUCKET,
  awsDefaultS3Url: process.env.AWS_DEFAULT_S3_URL,
  awsS3Region: process.env.AWS_S3_REGION,
  firebaseConfigFilePath: process.env.FIREBASE_CONFIG_FILE_PATH,
  maxFileSize: 5242880, // 5mb
}));
