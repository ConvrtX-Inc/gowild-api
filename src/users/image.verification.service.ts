import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CompareFacesCommand, RekognitionClient } from '@aws-sdk/client-rekognition';
import * as fs from 'fs';

@Injectable()
export class ImageVerificationService {
    constructor(private readonly configService: ConfigService) { }

    async verifyImagesAreSame(image1: Express.Multer.File, image2: Express.Multer.File) {

        const driver = this.configService.get('file.driver');

        const rekognition = new RekognitionClient({

            region: this.configService.get<string>('awsConfig.region'),
            credentials: {
                accessKeyId: this.configService.get<string>('awsConfig.accessKeyId'),
                secretAccessKey: this.configService.get<string>('awsConfig.secretAccessKey'),
            },
        });

        let bytes1 = null;
        let bytes2 = null;
        if (driver == 's3') {
            bytes1 = fs.readFileSync(image1['s3']);
            bytes2 = fs.readFileSync(image2['s3']);
        } else {
            bytes1 = fs.readFileSync(image1['local'].path);
            bytes2 = fs.readFileSync(image2['local'].path);
        }

        const command = new CompareFacesCommand({
            SourceImage: { Bytes: bytes1 },
            TargetImage: { Bytes: bytes2 },
            SimilarityThreshold: 80,
        });

        const result = await rekognition.send(command);
        return result.FaceMatches.length > 0;
    }
}
