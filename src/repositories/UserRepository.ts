import * as bcrypt from 'bcrypt';

import { HttpError } from '../helpers/errors/HttpError';
import { UserAuthOptions } from '../helpers/TypeOptions';
import { IUser } from '../interfaces';
import User from '../models/User';
import { IUserRepository } from './interfaces';

export default class UserRepository implements IUserRepository {
  async createUser(userAuthOptions: UserAuthOptions): Promise<IUser> {
    const { username, password } = userAuthOptions;
    const existingUser = await this.getUserByUsername(username);

    if (existingUser) {
      throw new HttpError({ status: 409, message: 'User with that username already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    return User.create({ username, password: hashedPassword });
  }

  async authenticateUser(userAuthOptions: UserAuthOptions): Promise<IUser> {
    const { username, password } = userAuthOptions;

    const user = await this.getUserByUsername(username);

    if (!user) {
      throw new HttpError({ status: 404, message: 'User not found.' });
    }

    const result = await bcrypt.compare(password, user.password);

    if (!result) {
      throw new HttpError({ status: 401, message: 'Username and password mismatch.' });
    }

    return user;
  }

  async getUsers(): Promise<IUser> {
    return User.find({}).lean();
  }

  async getUserById(userId: string): Promise<IUser> {
    try {
      return await User.findById(userId).lean();
    } catch (err) {
      throw new HttpError({ status: 404, message: 'User not found.' });
    }
  }

  async updateUser(userId: string, updateParams: any): Promise<void> {
    const passwordHash = updateParams.password
      ? await bcrypt.hash(updateParams.password, 10)
      : undefined;

    await User.updateOne({ _id: userId }, { $set: { ...updateParams, password: passwordHash } });
  }

  private async getUserByUsername(username: string) {
    return User.findOne({ username });
  }
}
