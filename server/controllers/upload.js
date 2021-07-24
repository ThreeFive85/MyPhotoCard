import multer from 'multer';
import multerS3 from 'multer-s3';
import AWS from 'aws-sdk';
import path from 'path';

import { aws } from '../config/aws_image.js';

import mysql from 'mysql2/promise';

import { db } from '../config/db.js';

const pool = mysql.createPool(db);

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

  export const deleteImg = async (req, res, next) => {
    const connection = await pool.getConnection();

    const { id } = req.params;

    try {
      const img = await connection.query(`SELECT selectedFile FROM cards WHERE id = ${id}`);
        // console.log(userId[0][0].selectedFile)
      const url = img[0][0].selectedFile.split('/');
      const del = url[url.length - 1]

      const params = {
        Bucket: aws.bucket,
        Key: del
      }

      s3.deleteObject(params, function(err, data) {
        if (err) {
          console.log('aws image delete error')
          console.log(err, err.stack)
          // res.redirect(routes.home)
        } else {
          console.log('aws image delete success' + data)
        }
      })
    } catch (error) {
      console.log(error);
    } finally {
      connection.release();
    }
    next();
  }