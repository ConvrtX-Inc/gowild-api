import { Module } from '@nestjs/common';
import { SystemSupportController } from './system-support.controller';
import { SystemSupportService } from './system-support.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemSupport } from './system-support.entity';
import { SupportGateway } from './support.gateway';
import { TicketModule } from '../ticket/ticket.module';
import { TicketMessagesModule } from '../ticket-messages/ticket-messages.module';
import { SystemSupportAttachmentService } from 'src/system-support-attachment/system-support-attachment.service';
import { SystemSupportAttachment } from 'src/system-support-attachment/system-support-attachment.entity';
import { FilesModule } from 'src/files/files.module';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { diskStorage } from 'multer';
import * as AWS from 'aws-sdk';
import * as multerS3 from 'multer-s3';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import path from 'path';
import { UnprocessableEntityException } from '@nestjs/common/exceptions';
// import { UsersService } from 'src/users/users.service';

@Module({
  controllers: [SystemSupportController],
  providers: [SystemSupportService, SupportGateway,SystemSupportAttachmentService],
  exports: [SystemSupportService],
  imports: [
    TypeOrmModule.forFeature([SystemSupport,SystemSupportAttachment]),FilesModule,
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
                accessKeyId: configService.get('file.accessKeyId'),
                secretAccessKey: configService.get('file.secretAccessKey'),
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
            if (!file.originalname.match(/\.(jpg|jpeg|png|gif|pdf|txt|docx)$/i)) {
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
  
    TicketModule,
    TicketMessagesModule,
  ],
})
export class SystemSupportModule {}
