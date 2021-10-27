import * as _ from 'lodash';

import { UserAuth, UserPublic } from '../types';
import { UserAuthOptions } from '../helpers/TypeOptions';

import { IUserService } from './interfaces';
import { IUser } from '../interfaces';
import { generateAccessToken } from '../helpers/JwtHelper';
import { IUserRepository } from '../repositories/interfaces';

export default class UserService implements IUserService {
  private userRepository;

  public constructor({ userRepository }: { userRepository: IUserRepository }) {
    this.userRepository = userRepository;
  }

  public async getUser(id: string): Promise<UserPublic> {
    const user = await this.userRepository.getUserById(id);
    return this.mapUserToUserPublic(user);
  }

  public async signup(userAuthOptions: UserAuthOptions): Promise<UserAuth> {
    const user = await this.userRepository.createUser(userAuthOptions);
    return this.mapUserToUserAuth(user);
  }

  public async login(userAuthOptions: UserAuthOptions): Promise<UserAuth> {
    const user = await this.userRepository.authenticateUser(userAuthOptions);
    return this.mapUserToUserAuth(user);
  }

  public async updateLikes(data: any): Promise<void> {
    const user = await this.userRepository.getUserById(data.userId);
    const likes = new Set(user.likes as string[]);

    if (data.like) {
      likes.add(data.likerId);
    } else {
      likes.delete(data.likerId);
    }

    await this.userRepository.updateUser(data.userId, { likes: Array.from(likes) });
  }

  public async updatePassword(data): Promise<void> {
    await this.userRepository.updateUser(data.userId, { password: data.password });
  }

  public async getMostLikedUsers(): Promise<UserPublic[]> {
    const users = await this.userRepository.getUsers();

    return _.chain(users)
      .map(user => this.mapUserToUserPublic(user))
      .orderBy('likes', 'desc');
  }

  private mapUserToUserPublic(user: IUser): UserPublic {
    return {
      id: user._id,
      username: user.username,
      likes: user.likes
        ? user.likes.length
        : 0,
    };
  }

  private mapUserToUserAuth(user: IUser): UserAuth {
    const token = generateAccessToken(user._id);

    return {
      id: user._id,
      username: user.username,
      token,
    };
  }
}
