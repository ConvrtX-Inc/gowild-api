import {Module, UnprocessableEntityException} from '@nestjs/common';
import { TreasureChestService } from './treasure-chest.service';
import { TreasureChestController } from './treasure-chest.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TreasureChest } from './entities/treasure-chest.entity';
import {MulterModule} from "@nestjs/platform-express";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {diskStorage} from "multer";
import {randomStringGenerator} from "@nestjs/common/utils/random-string-generator.util";
import * as AWS from "aws-sdk";
import * as multerS3 from 'multer-s3';
import path from "path";
import {FilesModule} from "../files/files.module";
import {TreasureWildController} from "../treasure-chest/treasure-wild.controller"
import { TreasureWildService } from './treasure-wild.service';
import { UserTreasureHuntModule } from 'src/user-treasure-hunt/user-treasure-hunt.module';
import {NotificationService} from "../notification/notification.service";
import {Notification} from "../notification/notification.entity";
import {UserTreasureHuntService} from "../user-treasure-hunt/user-treasure-hunt.service";
import {UserTreasureHuntEntity} from "../user-treasure-hunt/user-treasure-hunt.entity";


@Module({
  controllers: [TreasureChestController,TreasureWildController],
  providers: [TreasureChestService,TreasureWildService, NotificationService, UserTreasureHuntService],
  imports: [UserTreasureHuntModule,TypeOrmModule.forFeature([TreasureChest,Notification, UserTreasureHuntEntity]),FilesModule, MulterModule.registerAsync({
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
  })],
})
export class TreasureChestModule {}
