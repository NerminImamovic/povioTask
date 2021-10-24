import { Router, Request, Response } from 'express';

import UserService from '../services/UserService';
import { IUserService } from '../services/interfaces';
import { AuthorizedRequest } from '../helpers/AuthorizedRequest';

const userService:IUserService = new UserService();

export const signup = async (req:Request, res:Response) => {
  try {
    const userAuth = await userService.signup(req.body);

    return res.json(userAuth);
  } catch (err) {
    res.sendStatus(err.status || 500);
  }
};

export const login = async (req:Request, res:Response) => {
  try {
    const userAuth = await userService.login(req.body);
    return res.json(userAuth);
  } catch (err) {
    res.sendStatus(err.status || 500);
  }
};

export const getMe = async (req:AuthorizedRequest, res:Response) => {
  try {
    const user = await userService.getUser(req.user._id);
    res.json(user);
  } catch (err) {
    res.sendStatus(err.status || 500);
  }
};

export const getUserById = async (req:Request, res:Response) => {
  try {
    const user = await userService.getUser(req.params.id);
    res.json(user);
  } catch (err) {
    res.sendStatus(err.status || 500);
  }
};

export const likeUser = async (req: AuthorizedRequest, res:Response) => {
  try {
    await userService.updateLikes({
      likerId: req.user._id,
      userId: req.params.id,
      like: true,
    });
    return res.sendStatus(200);
  } catch (err) {
    res.sendStatus(err.status || 500);
  }
};

export const unlikeUser = async (req: AuthorizedRequest, res:Response) => {
  try {
    await userService.updateLikes({
      likerId: req.user._id,
      userId: req.params.id,
      like: false,
    });
    return res.sendStatus(200);
  } catch (err) {
    res.sendStatus(err.status || 500);
  }
};

export const updatePassword = async (req: AuthorizedRequest, res:Response) => {
  try {
    await userService.updatePassword({
      userId: req.user._id,
      password: req.body.password,
    });
    return res.sendStatus(200);
  } catch (err) {
    res.sendStatus(500);
  }
};

export const getMostLikedUsers = async (req:Request, res:Response) => {
  try {
    const users = await userService.getMostLikedUsers();
    return res.json({ users });
  } catch (err) {
    res.sendStatus(500);
  }
};

// export { signup, getMostLikedUsers. updatePassword };
