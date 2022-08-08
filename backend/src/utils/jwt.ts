import { sign, verify, SignOptions } from 'jsonwebtoken';

interface JwtPayload {
    id: string,
    displayName: string,
    role: string,
    vpoints: number
}

export const issueJwt = (
    id: string,
    displayName: string,
    role: string,
    vpoints: number
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

export const verifyJwt = (id: string, token: string) => {
    try{
    const decodedToken = verify(token, process.env.JWT_SECRET);
    if (typeof decodedToken !== 'string') {
        return decodedToken.id === id;
    }
    } catch (err) {
        console.log(err);
        return false;
    }

}