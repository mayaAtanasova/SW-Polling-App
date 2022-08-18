import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import authService from '../services/authService'

import { useMyDispatch, useMySelector } from '../hooks/useReduxHooks';
import { setUser } from '../store/authSlice';
import jwtDecoder from '../helpers/jwtDecoder';
import Login from '../Pages/Login/Login';
import Register from '../Pages/Register/Register';
import IntroPage from '../Components/IntroPage/IntroPage';
import { clearMessage } from '../store/messageSlice';
import './Auth.css';

const clientId: string = process.env.REACT_APP_GOOGLE_CLIENT_ID ?? '';

const AuthView = () => {

    const [showMessage, setShowMessage] = useState(false);

    const dispatch = useMyDispatch();
    const { message } = useMySelector((state: any) => state.message);

    useEffect(() => {
        if (message) {
            setShowMessage(true);
            setTimeout(() => {
                dispatch(clearMessage());
                setShowMessage(false);
            }, 5000);
        }
    }, [message]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return;
        const userData = jwtDecoder(token);
        if (!userData) return;
        verifyRequest(userData.id, token);
    }, []);

    const verifyRequest = async (id: string, token: string) => {
        let response;
        try {
            response = await authService.verifyUser(id, token);
            console.log(response);
        } catch (err: any) {
            console.log('error verifying user' + err);
            return;
        }
        if (!response.access) {
            localStorage.clear();
            dispatch(setUser(null));
            return;
        }
        const user = jwtDecoder(token)
        dispatch(setUser(user));
    }

    return (
        <GoogleOAuthProvider clientId={clientId}>
            {message && (
                <div className="authInfoMessage">
                    {message}
                </div>
            )}
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/" element={<IntroPage />} />
                    <Route path="/logout" element={<IntroPage />} />
                </Routes>
            </BrowserRouter>
        </GoogleOAuthProvider>
    )
}

export default AuthView;