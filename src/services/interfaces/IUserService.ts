import {
  UserAuth,
  UserPublic,
} from '../../types';
import {
  UpdateLikesOptions,
  UpdatePasswordOptions,
  UserAuthOptions,
} from '../../helpers/TypeOptions';

interface IUserService {
  getUser(id:string):Promise<UserPublic>;
  signup(userAuthOptions:UserAuthOptions):Promise<UserAuth>;
  login(userAuthOptions:UserAuthOptions):Promise<UserAuth>;
  updatePassword(updatePasswordOptions:UpdatePasswordOptions):Promise<void>;
  updateLikes(updateLikesOptions:UpdateLikesOptions):Promise<void>;
  getMostLikedUsers():Promise<UserPublic[]>;
}

export default IUserService;
