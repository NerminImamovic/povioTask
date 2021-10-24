import * as jwt from 'jsonwebtoken';

export const generateAccessToken = userId => jwt.sign({ _id: userId }, 'secret', { expiresIn: 3600 });
