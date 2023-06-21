import { editFileName, imageFileFilter } from './helpers';
import { diskStorage } from 'multer';
import {
  FileInterceptor,
  FileFieldsInterceptor,
} from '@nestjs/platform-express';
import * as fs from 'fs';
export class SingleImageStrategy extends FileInterceptor('image', {
  storage: diskStorage({
    destination: (req, file, cb) => {
      if (!fs.existsSync('uploads')) {
        fs.mkdirSync('uploads');
      }
      cb(null, 'uploads');
    },
    filename: editFileName,
  }),
  fileFilter: imageFileFilter,
}) {}
export class CompleteUserProfileStrategy extends FileFieldsInterceptor(
  [
    { name: 'idCard', maxCount: 1 },
    { name: 'profileImage', maxCount: 1 },
  ],
  {
    storage: diskStorage({
      destination: (req, file, cb) => {
        if (!fs.existsSync('uploads')) {
          fs.mkdirSync('uploads');
        }
        cb(null, 'uploads');
      },
      filename: editFileName,
    }),
    fileFilter: imageFileFilter,
  },
) {}
