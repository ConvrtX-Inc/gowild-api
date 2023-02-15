import { Base64String } from 'aws-sdk/clients/wellarchitected';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as process from 'process';
import { S3 } from 'aws-sdk';

export function convertToImage(image: Base64String, extension: string): Promise<string> {
  const fileName = `${uuidv4()}.${extension}`;
  const buffer = Buffer.from(image, 'base64');
  const driver = process.env.FILE_DRIVER;

  if (driver == 's3'){
    /* set for S3 */
    const s3 = new S3({
      accessKeyId: process.env.ACCESS_KEY_ID,
      secretAccessKey: process.env.SECRET_ACCESS_KEY,
      region: process.env.AWS_S3_REGION
    });
    const params = {
      Bucket: process.env.AWS_DEFAULT_S3_BUCKET,
      Key: fileName,
      Body: buffer,
      ContentEncoding: 'base64',
      ContentType: `image/${extension}`
    };
    return new Promise((resolve, reject) => {
      s3.upload(params, (err, data) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          resolve(data.Location);
        }
      });
    });
  } else {
    // Currently set for local path only
    const filePath = `/files/${fileName}`;
    fs.writeFileSync(`${process.cwd()}${filePath}`, buffer);
    return Promise.resolve(`/${process.env.API_PREFIX}/v1${filePath}`);
  }

}

