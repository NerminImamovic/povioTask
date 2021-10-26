import * as jwt from 'jsonwebtoken';

import { JWT_SECRET } from '../constants';
import { IUser } from '../models/User';
import { HttpError } from '../helpers/errors/HttpError';

const authenticateUser = (req, res, next) => {
  // Gather the jwt access token from the request header
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    const httpError = new HttpError({ status: 401, message: 'User should provide token.' });

    return res.status(httpError.status).json({ message: httpError.message });
  }

  jwt.verify(token, JWT_SECRET, (err, user:IUser) => {
    if (err) {
      const httpError = new HttpError({ status: 401, message: 'Token is not valid.' });

      return res.status(httpError.status).json({ message: httpError.message });
    }
    req.user = user;
    next(); // pass the execution off to whatever request the client intended
  });
};

const validateAuthorizationParameters = (req, res, next) => {
  if (!req.body.username || !req.body.password) {
    const httpError = new HttpError({ status: 400, message: 'User should provide username and password.' });

    return res.status(httpError.status).json({ message: httpError.message });
  }
  next(); // pass the execution off to whatever request the client intended
};

const validatePasswordParam = (req, res, next) => {
  if (!req.body.password) {
    const httpError = new HttpError({ status: 400, message: 'User should provide password.' });

    return res.status(httpError.status).json({ message: httpError.message });
  }
  next(); // pass the execution off to whatever request the client intended
};

export {
  authenticateUser,
  validateAuthorizationParameters,
  validatePasswordParam,
};
