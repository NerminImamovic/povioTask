import { Request } from 'express';
import { IUser } from '../interfaces';

export interface AuthorizedRequest extends Request
{
  user: IUser;
}
