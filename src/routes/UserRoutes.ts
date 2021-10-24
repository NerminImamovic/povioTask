import { Router } from 'express';

import { authenticateUser, validateAuthorizationParameters, validatePasswordParam } from '../middleware';
import * as UserController from '../controllers/UserController';

const router = Router();

// /signup POST
router.post('/signup', validateAuthorizationParameters, UserController.signup);

// /login POST
router.post('/login', validateAuthorizationParameters, UserController.login);

// /me GET
router.get('/me', authenticateUser, UserController.getMe);

// /user/:id GET
router.get('/user/:id', UserController.getUserById);

// /user/:id/like PUT
router.put('/user/:id/like', authenticateUser, UserController.likeUser);

// /user/:id/unlike PUT
router.put('/user/:id/unlike', authenticateUser, UserController.unlikeUser);

// /me/update-password PUT
router.put('/me/update-password', [authenticateUser, validatePasswordParam], UserController.updatePassword);

// /most-liked GET
router.get('/most-liked', UserController.getMostLikedUsers);

export default router;
