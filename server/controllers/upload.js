import multer from 'multer';
import multerS3 from 'multer-s3';
import AWS from 'aws-sdk';
import path from 'path';

import { aws } from '../config/aws_image.js';

export const s3 = new AWS.S3({
    accessKeyId: aws.accessKeyId,
    secretAccessKey: aws.secretAccessKey,
    region: 'ap-northeast-2',
  });
  
export const upload = multer({
    storage: multerS3({
      s3: s3,
      bucket: aws.bucket,
      metadata: (req, file, cb) => {
        cb(null, { fieldName: file.fieldname });
      },
      key: (req, file, cb) => {
        let extension = path.extname(file.originalname); 
        cb(null, Date.now().toString() + extension)
      },
      acl: 'public-read-write',
      contentType: multerS3.AUTO_CONTENT_TYPE,
    }),
  });