import { decodeToken, isExpired } from 'react-jwt';
import { IUser } from '../Interfaces/IUser';

export default (userToken: string): any => {
    const user = decodeToken(userToken);
    return user;
}