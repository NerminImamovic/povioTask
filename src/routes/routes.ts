import { Router, Request, Response } from 'express';
import { authenticateUser, validateAuthorizationParameters, validatePasswordParam } from '../middlewares';

import UserService from '../services/UserService';
import { IUserService } from '../services/interfaces';
import { RequestCustom } from '../helpers/CustomRequest';

const userService:IUserService = new UserService();
const router = Router();

// /signup POST
router.post('/signup', validateAuthorizationParameters, async (req:Request, res:Response) => {
  try {
    const userAuth = await userService.signup(req.body);

    return res.json(userAuth);
  } catch (err) {
    res.sendStatus(409);
  }
});

// /login POST
router.post('/login', validateAuthorizationParameters, async (req:Request, res:Response) => {
  try {
    const userAuth = await userService.login(req.body);
    return res.json(userAuth);
  } catch (err) {
    res.sendStatus(err.status || 500);
  }
});

// /me GET
router.get('/me', authenticateUser, async (req:RequestCustom, res:Response) => {
  try {
    const user = await userService.getUser(req.user._id);
    res.json(user);
  } catch (err) {
    res.sendStatus(err.status || 500);
  }
});

// /user/:id GET
router.get('/user/:id', async (req:Request, res:Response) => {
  try {
    const user = await userService.getUser(req.params.id);
    res.json(user);
  } catch (err) {
    res.sendStatus(err.status || 500);
  }
});

// /user/:id/like PUT
router.put('/user/:id/like', authenticateUser, async (req: RequestCustom, res:Response) => {
  const data = {
    likerId: req.user._id,
    userId: req.params.id,
    like: true,
  };

  try {
    await userService.updateLikes(data);
    return res.sendStatus(200);
  } catch (err) {
    res.sendStatus(err.status || 500);
  }
});

// /user/:id/unlike PUT
router.put('/user/:id/unlike', authenticateUser, async (req: RequestCustom, res:Response) => {
  const data = {
    likerId: req.user._id,
    userId: req.params.id,
    like: false,
  };

  try {
    await userService.updateLikes(data);
    return res.sendStatus(200);
  } catch (err) {
    res.sendStatus(err.status || 500);
  }
});

// /me/update-password PUT
router.put('/me/update-password', [authenticateUser, validatePasswordParam], async (req: RequestCustom, res:Response) => {
  const userData = {
    userId: req.user._id,
    password: req.body.password,
  };

  try {
    await userService.updatePassword(userData);
    return res.sendStatus(200);
  } catch (err) {
    res.sendStatus(500);
  }
});

// /most-liked GET
router.get('/most-liked', async (req:Request, res:Response) => {
  try {
    const users = await userService.getMostLikedUsers();
    return res.json({ users });
  } catch (err) {
    res.sendStatus(500);
  }
});

export default router;
