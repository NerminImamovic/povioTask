import { Request, Response } from 'express';

import { AuthorizedRequest } from '../helpers/AuthorizedRequest';
import logger from '../lib/logger';
import { SOMETHING_WENT_WRONG_ERROR } from '../constants';
import { IUserRepository } from '../repositories/interfaces';
import { UserRepository } from '../repositories';
import { UserService } from '../services';
import { IUserService } from '../services/interfaces';

const userRepository: IUserRepository = new UserRepository();
const userService: IUserService = new UserService({ userRepository });

export const signup = async (req: Request, res: Response) => {
  logger.info('POST /signup');

  try {
    const userAuth = await userService.signup(req.body);

    return res.json(userAuth);
  } catch (err) {
    const errStatus = err.status || 500;
    const errorMessage = err.message || SOMETHING_WENT_WRONG_ERROR;

    return res.status(errStatus).json({ message: errorMessage });
  }
};

export const login = async (req: Request, res: Response) => {
  logger.info('POST /login');

  try {
    const userAuth = await userService.login(req.body);

    return res.json(userAuth);
  } catch (err) {
    const errStatus = err.status || 500;
    const errorMessage = err.message || SOMETHING_WENT_WRONG_ERROR;

    return res.status(errStatus).json({ message: errorMessage });
  }
};

export const getMe = async (req: AuthorizedRequest, res: Response) => {
  logger.info('GET /me');

  try {
    const user = await userService.getUser(req.user._id);

    res.json(user);
  } catch (err) {
    const errStatus = err.status || 500;
    const errorMessage = err.message || SOMETHING_WENT_WRONG_ERROR;

    return res.status(errStatus).json({ message: errorMessage });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  logger.info('GET /user/:id');

  try {
    const user = await userService.getUser(req.params.id);
    res.json(user);
  } catch (err) {
    const errStatus = err.status || 500;
    const errorMessage = err.message || SOMETHING_WENT_WRONG_ERROR;

    return res.status(errStatus).json({ message: errorMessage });
  }
};

export const likeUser = async (req: AuthorizedRequest, res: Response) => {
  logger.info('PUT /user/:id/like');

  try {
    await userService.updateLikes({
      likerId: req.user._id,
      userId: req.params.id,
      like: true,
    });

    return res.sendStatus(200);
  } catch (err) {
    const errStatus = err.status || 500;
    const errorMessage = err.message || SOMETHING_WENT_WRONG_ERROR;

    return res.status(errStatus).json({ message: errorMessage });
  }
};

export const unlikeUser = async (req: AuthorizedRequest, res: Response) => {
  logger.info('PUT /user/:id/unlike');

  try {
    await userService.updateLikes({
      likerId: req.user._id,
      userId: req.params.id,
      like: false,
    });
    return res.sendStatus(200);
  } catch (err) {
    const errStatus = err.status || 500;
    const errorMessage = err.message || SOMETHING_WENT_WRONG_ERROR;

    return res.status(errStatus).json({ message: errorMessage });
  }
};

export const updatePassword = async (req: AuthorizedRequest, res: Response) => {
  logger.info('PUT /me/update-password');

  try {
    await userService.updatePassword({
      userId: req.user._id,
      password: req.body.password,
    });
    return res.sendStatus(200);
  } catch (err) {
    const errStatus = err.status || 500;
    const errorMessage = err.message || SOMETHING_WENT_WRONG_ERROR;

    return res.status(errStatus).json({ message: errorMessage });
  }
};

export const getMostLikedUsers = async (req: Request, res: Response) => {
  logger.info('GET /most-liked');

  try {
    const users = await userService.getMostLikedUsers();

    return res.json({ users });
  } catch (err) {
    const errStatus = err.status || 500;
    const errorMessage = err.message || SOMETHING_WENT_WRONG_ERROR;

    return res.status(errStatus).json({ message: errorMessage });
  }
};
