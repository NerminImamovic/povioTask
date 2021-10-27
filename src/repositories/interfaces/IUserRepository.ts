import { UserAuthOptions } from '../../helpers/TypeOptions';
import { IUser } from '../../interfaces';

interface IUserRepository {
    getUsers(): Promise<IUser>;
    getUserById(id: string): Promise<IUser>;
    updateUser(id: string, options: any): Promise<void>;
    createUser(userAuthOptions: UserAuthOptions): Promise<IUser>;
    authenticateUser(userAuthOptions: UserAuthOptions): Promise<IUser>;
};

export default IUserRepository;
