import * as jwt from 'jsonwebtoken';

import { IUser } from '../models/User';

const authenticateUser = (req, res, next) => {
  // Gather the jwt access token from the request header
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) { return res.sendStatus(401); } // if there isn't any token

  jwt.verify(token, 'secret', (err, user:IUser) => {
    if (err) return res.sendStatus(401);
    req.user = user;
    next(); // pass the execution off to whatever request the client intended
  });
};

const validateAuthorizationParameters = (req, res, next) => {
  if (!req.body.username || !req.body.password) {
    return res.sendStatus(400);
  }
  next(); // pass the execution off to whatever request the client intended
};

const validatePasswordParam = (req, res, next) => {
  if (!req.body.password) {
    return res.sendStatus(400);
  }
  next(); // pass the execution off to whatever request the client intended
};

const generateAccessToken = userId => jwt.sign({ _id: userId }, 'secret', { expiresIn: 3600 });

export {
  authenticateUser,
  validateAuthorizationParameters,
  validatePasswordParam,
  generateAccessToken,
};
