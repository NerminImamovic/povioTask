import { UserAuth, UserPublic } from '../../types';

interface IUserService {
  getUser(id:string):Promise<UserPublic>;
  signup(data):Promise<UserAuth>;
  login(data):Promise<UserAuth>;
  updatePassword(data):Promise<void>;
  updateLikes(data):Promise<void>;
  getMostLikedUsers():Promise<UserPublic[]>;
}

export default IUserService;
