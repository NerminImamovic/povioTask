import * as jwt from 'jsonwebtoken';

import { JWT_SECRET } from '../constants';
import { IUser } from '../interfaces';
import { HttpError } from '../helpers/errors/HttpError';

const authenticateUser = (req, res, next) => {
  const authHeader = req.headers.auth;
  const token = authHeader
    && authHeader.substring(0, 7) === 'Bearer '
    && authHeader.split(' ')[1];

  if (!token) {
    const httpError = new HttpError({ status: 401, message: 'User should provide token.' });

    return res.status(httpError.status).json({ message: httpError.message });
  }

  jwt.verify(token, JWT_SECRET, (err, user: IUser) => {
    if (err) {
      const httpError = new HttpError({ status: 401, message: 'Token is not valid.' });

      return res.status(httpError.status).json({ message: httpError.message });
    }
    req.user = user;
    next();
  });
};

const validateAuthorizationParameters = (req, res, next) => {
  if (!req.body.username || !req.body.password) {
    const httpError = new HttpError({ status: 400, message: 'User should provide username and password.' });

    return res.status(httpError.status).json({ message: httpError.message });
  }
  next();
};

const validatePasswordParam = (req, res, next) => {
  if (!req.body.password) {
    const httpError = new HttpError({ status: 400, message: 'User should provide password.' });

    return res.status(httpError.status).json({ message: httpError.message });
  }
  next();
};

export {
  authenticateUser,
  validateAuthorizationParameters,
  validatePasswordParam,
};
