import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

@Injectable()
export class CloudinaryService {
  constructor(private readonly configService: ConfigService) {}

  async uploadImage(file: MulterFile, folder: string = 'categories') {
    const cloudinary = require('cloudinary').v2;
    
    return new Promise((resolve, reject) => {
      const uploadOptions = {
        folder,
        resource_type: 'auto',
        public_id: `${folder}/${Date.now()}_${file.originalname.split('.')[0]}`,
      };

      cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
            format: result.format,
            resourceType: result.resource_type,
          });
        }
      }).end(file.buffer);
    });
  }

  async deleteImage(publicId: string) {
    const cloudinary = require('cloudinary').v2;
    
    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  }
}