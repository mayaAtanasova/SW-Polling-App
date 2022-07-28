import { IUser } from "../Interfaces/IUser";
import jwtDecoder from '../hooks/jwtDecoder';
import { TokenResponse, useGoogleLogin } from '@react-oauth/google'


const api_url = 'http://localhost:4000/auth'


const register = async (user: IUser) => {
    console.log(user);
    try {
        const response = await fetch(api_url + '/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        })
        if (response.status === 401) {
            const errorData = await response.json();
            throw new Error(errorData.message);
        }
        const data = await response.json();
        let loggedUser = null;
        if (data.token) {
            loggedUser = jwtDecoder(data.token);
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(loggedUser));
        }
        return {
            message: data.message,
            user: loggedUser
        };
    } catch (error: any) {
        const message =
            (error.response && error.response.data && error.response.data.message)
            || error.message
            || error.toString();
        throw new Error(message);
    }
}

const login = async (user: { email: string, password: string }) => {
    try {
        const response = await fetch(api_url + '/login', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        })
        if (response.status === 401) {
            const errorData = await response.json();
            throw new Error(errorData.message);
        }
        const data = await response.json();
        let loggedUser = null;
        if (data.token) {
            loggedUser = jwtDecoder(data.token);
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(loggedUser));
        }
        return {
            message: data.message,
            user: loggedUser
        };
    } catch (error: any) {
        const message =
            (error.response && error.response.data && error.response.data.message)
            || error.message
            || error.toString();
        throw new Error(message);
    }
};

const googleLogin = async (tokenResponse: TokenResponse): Promise<{ message: string; user: IUser }> => {
    try {
        const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        })
        const userInfo = await response.json();
        const { email, given_name, family_name, name } = userInfo;
        const user = {
            email,
            firstName: given_name,
            lastName: family_name,
            role: 'user',
            displayName: name,
        }
        const regResponse = await fetch(api_url + '/google', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        })
        const data = await regResponse.json();
        let loggedUser = null;
        if (data.token) {
            loggedUser = jwtDecoder(data.token);
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(loggedUser));
        }
        return {
            message: data.message,
            user: loggedUser
        };
    } catch (error: any) {
        const message =
            (error.response && error.response.data && error.response.data.message)
            || error.message
            || error.toString();
        throw new Error(message);
    }
};

const logout = async () => {
    localStorage.clear();
}

export default {
    register,
    login,
    googleLogin,
    logout,
}