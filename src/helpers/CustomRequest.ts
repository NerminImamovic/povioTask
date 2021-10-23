import { Request } from 'express';
import { IUser } from '../models/User';

export interface RequestCustom extends Request
{
  user: IUser;
}
