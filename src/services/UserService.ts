import * as _ from 'lodash';

import { UserAuth, UserPublic, UserVerificationData } from '../types';

import { IUserService } from './interfaces';
import User, { IUser } from '../models/User';
import { generateAccessToken } from '../middlewares';
import { HttpError } from '../helpers/errors/HttpError';

export default class UserService implements IUserService {
  public async getUser(id: string):Promise<UserPublic> {
    const user = await this.getUserFromDatabase(id);
    return this.mapUserToUserPublic(user);
  }

  public async signup(verificationData:UserVerificationData):Promise<UserAuth> {
    const existingUser = await User.findOne({ username: verificationData.username });

    if (existingUser) {
      throw new HttpError({ status: 409, message: 'User with that username currently exists' });
    }

    const user = await User.create(verificationData);
    return this.mapUserToUserAuth(user);
  }

  public async login(verificationData:UserVerificationData):Promise<UserAuth> {
    const user = await User.authenticate(verificationData);
    return this.mapUserToUserAuth(user);
  }

  public async updateLikes(data: any):Promise<void> {
    const user = await this.getUserFromDatabase(data.userId);
    const likes = new Set(user.likes as string[]);

    if (data.like) {
      likes.add(data.likerId);
    } else {
      likes.delete(data.likerId);
    }

    await User.updateOne({ _id: data.userId }, { $set: { likes: Array.from(likes) } });
  }

  public async updatePassword(data):Promise<void> {
    await User.updateOne({ _id: data.userId }, { $set: { password: data.password } });
  }

  public async getMostLikedUsers():Promise<UserPublic[]> {
    const users = await User.find({}).lean();

    return _.chain(users)
      .map(user => this.mapUserToUserPublic(user))
      .orderBy('likes', 'desc');
  }

  private async getUserFromDatabase(id: string):Promise<IUser> {
    try {
      return await User.findById(id).lean();
    } catch (err) {
      throw new HttpError({ status: 404, message: 'User not found.' });
    }
  }

  private mapUserToUserPublic(user:IUser):UserPublic {
    return {
      id: user._id,
      username: user.username,
      likes: user.likes
        ? user.likes.length
        : 0,
    };
  }

  private mapUserToUserAuth(user:IUser):UserAuth {
    const token = generateAccessToken(user._id);

    return {
      id: user._id,
      username: user.username,
      token,
    };
  }
}
