import {
  Model, Schema, model,
} from 'mongoose';

import { IUser } from '../interfaces';

interface IUserModel extends Model<IUser> { }

const UserSchema = new Schema<IUser>({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  likes: Array,
});

const User: IUserModel = model<IUser, IUserModel>('User', UserSchema);

export default User;
