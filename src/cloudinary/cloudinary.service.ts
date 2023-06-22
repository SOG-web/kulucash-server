import { Injectable } from '@nestjs/common';
import {
  UploadApiErrorResponse,
  UploadApiOptions,
  UploadApiResponse,
  v2,
} from 'cloudinary';
import * as fs from 'fs';

@Injectable()
export class CloudinaryService {
  async uploadImage(
    file: any,
    options?: UploadApiOptions,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    try {
      const re = await v2.uploader.upload(file.path, options);
      fs.unlinkSync(file.path);
      return re;
    } catch (err) {
      console.log(err);
    }
  }
}
