import { UserAuth, UserPublic } from '../../types';

interface IUserService {
  getUser(id:string):Promise<UserPublic>;
  signup(userAuthOptions):Promise<UserAuth>;
  login(userAuthOptions):Promise<UserAuth>;
  updatePassword(updatePasswordOptions):Promise<void>;
  updateLikes(updateLikesOptions):Promise<void>;
  getMostLikedUsers():Promise<UserPublic[]>;
}

export default IUserService;
