import { sign, SignOptions } from 'jsonwebtoken';

export const issueJwt = (
    id:string, 
    displayName:string, 
    role:string, 
    vpoints:number
    ) => {
    const payload = {
        id,
        displayName,
        role,
        vpoints
    };
    const options: SignOptions = {
        expiresIn: '1d',
    };
    return sign(payload, process.env.JWT_SECRET, options);
};