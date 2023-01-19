import { Base64String } from 'aws-sdk/clients/wellarchitected';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import path from 'path';
import * as process from 'process';
import { S3 } from 'aws-sdk';
import AWS from 'aws-sdk'
import { ConfigService } from '@nestjs/config';


export function convertToImage(image: Base64String, extension: string): string {
  const configService = new ConfigService()
  const driver = configService.get('file.driver')

  const fileName = `${uuidv4()}.${extension}`;
  const buffer = Buffer.from(image, 'base64');
  if (driver === 's3'){
       /* set for S3 */
   const s3 = new AWS.S3({
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY
  })

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileName,
    Body: buffer
  }

  s3.upload(params, (err, data) => {
    if (err) {
      console.log(err);
      return err;
    } else {
      console.log(data.location)
      return data.Location
    }})

  }else{

    // Currently set for local path only
  const filePath = `/files/${fileName}`;
  fs.writeFileSync(`${process.cwd()}${filePath}`, buffer);
  return `/${process.env.API_PREFIX}/v1/${filePath}`;
  }

  
}
