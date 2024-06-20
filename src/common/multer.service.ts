import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';


@Injectable()
export class MulterService {
  constructor(private configService: ConfigService) {}

  AWS_S3_BUCKET = 'athena-img';
  s3 = new AWS.S3({
    accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
    secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
  });

  async uploadFile(file: Express.Multer.File, filename: string) {
    const s3Response =  await this.s3_upload(
      file.buffer,
      this.AWS_S3_BUCKET,
      filename,
      file.mimetype,
    );

    return s3Response.Location;
  }

  async s3_upload(file: AWS.S3.Body, bucketName: string, filename: string, mimetype: string) {
    const params: AWS.S3.PutObjectRequest = {
      Bucket: bucketName,
      Key: filename,
      Body: file,
      ContentType: mimetype,
      ContentDisposition: 'inline',
    };

    try {
      let s3Response = await this.s3.upload(params).promise();
      return s3Response;
    } catch (e) {
      console.log(e);
    }
  }
}
