import { Request } from 'express';
import { IUser } from '../models/User';

export interface AuthorizedRequest extends Request
{
  user: IUser;
}
