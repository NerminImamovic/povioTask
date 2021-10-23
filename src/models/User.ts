import {
  Model, Schema, model,
} from 'mongoose';
import * as bcrypt from 'bcrypt';
import { UserVerificationData } from '../types';
import { HttpError } from '../helpers/errors/HttpError';

export interface IUser {
  _id: string;
  username: string;
  password: string;
  likes: string[];
}

interface IUserModel extends Model<IUser> {
  authenticate(verificationData:UserVerificationData):IUser;
}

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

// hashing a password before saving it to the database
UserSchema.pre('save', function (next) {
  const user = this;
  bcrypt.hash(user.password, 10, (err, hash) => {
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  });
});

UserSchema.pre('updateOne', { document: true, query: true }, async function (next) {
  const update = this._update;

  // update.$set.password = await bcrypt.hash(update.$set.password, 10);

  if (update.$set.password) {
    bcrypt.hash(update.$set.password, 10, (err, hash) => {
      if (err) {
        return next(err);
      }
      update.$set.password = hash;
      next();
    });
  }
});

// authenticate input against database
UserSchema.statics.authenticate = async (verificationData:UserVerificationData):Promise<IUser> => {
  const { username, password } = verificationData;

  const user = await User.findOne({ username });

  if (!user) {
    throw new HttpError({ status: 404, message: 'User not found' });
  }

  const result = await bcrypt.compare(password, user.password);

  if (result) {
    return user;
  }

  throw new HttpError({ status: 401, message: 'Username and password mismatch' });
};

const User: IUserModel = model<IUser, IUserModel>('User', UserSchema);

export default User;