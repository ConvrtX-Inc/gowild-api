import { Module, UnprocessableEntityException } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { diskStorage } from 'multer';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import * as AWS from 'aws-sdk';
import * as multerS3 from 'multer-s3';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileEntity } from './file.entity';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import * as path from 'path';

@Module({
  imports: [
    TypeOrmModule.forFeature([FileEntity]),
    MulterModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const storages: Record<files.FileType, files.VoidStorageEngineConfig> =
          {
            local: () =>
              diskStorage({
                destination: './files',
                filename: (request, file, callback) => {
                  callback(
                    null,
                    `${randomStringGenerator()}.${file.originalname
                      .split('.')
                      .pop()
                      .toLowerCase()}`,
                  );
                },
              }),
            s3: () => {
              
              const s3 = new AWS.S3();
              AWS.config.update({
                credentials: {
                  accessKeyId: configService.get('file.accessKeyId'),
                  secretAccessKey: configService.get('file.secretAccessKey'),
              
                },
                region: configService.get('file.awsS3Region'),
        
              });

              return multerS3({
                s3: s3, 
                bucket: configService.get('file.awsDefaultS3Bucket'),
                acl: 'public-read',
                contentType: multerS3.AUTO_CONTENT_TYPE,
                key: (request, file, callback) => {
                  callback(
                    null,
                    `${randomStringGenerator()}.${file.originalname
                      .split('.')
                      .pop()
                      .toLowerCase()}`,
                  );
                },
              });
            },
            firebase: () => {
              const FirebaseStorage = require('multer-firebase-storage');
              const googleFileConfig = path.join(
                process.cwd(),
                configService.get('file.firebaseConfigFilePath'),
              );
              const googleConfigFile = require(googleFileConfig);

              return FirebaseStorage({
                bucketName: googleConfigFile.project_id + '.appspot.com',
                credentials: {
                  clientEmail: googleConfigFile.client_email,
                  privateKey: googleConfigFile.private_key,
                  projectId: googleConfigFile.project_id,
                },
                appName: 'convrtx-dev',
                namePrefix: 'gw-',
                nameSuffix: '-npi--',
                unique: true,
                public: true,
              });
            },
          };

        return {
          fileFilter: (request, file, callback) => {
            if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
              return callback(
                new UnprocessableEntityException({
                  errors: [
                    {
                      file: `cantUploadFileType`,
                    },
                  ],
                }),
                false,
              );
            }

            callback(null, true);
          },
          storage: storages[configService.get('file.driver')](),
          limits: {
            fileSize: configService.get('file.maxFileSize'),
          },
        };
      },
    }),
  ],
  controllers: [FilesController],
  providers: [ConfigModule, ConfigService, FilesService],
  exports: [FilesService],
})
export class FilesModule {}
