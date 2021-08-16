import jwt from 'jsonwebtoken';
import { tokenPassword } from '../config/token.js';

const auth = async (req, res, next) => {
  try {
    // console.log(req.headers.authorization)
    // const token = req.headers.authorization;
    const token = req.headers.authorization.split(" ")[1];
    // console.log(token)
    const isCustomAuth = token.length < 500;

    let decodedData;

    if (token && isCustomAuth) {      
      decodedData = jwt.verify(token, tokenPassword);
      // console.log('decodedData', decodedData);
      req.userEmail = decodedData?.email;
    } else {
      decodedData = jwt.decode(token);

      req.userEmail = decodedData?.sub;
    }    

    next();
  } catch (error) {
    console.log(error);
  }
};

export default auth;