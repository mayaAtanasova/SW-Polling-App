import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import io, { Socket } from 'socket.io-client';

import { Provider } from 'react-redux';
import store from './store/store';

import Home from './Pages/Home/Home';
import Navbar from './Components/Navbar/Navbar';
import Login from './Pages/Login/Login';
import Register from './Pages/Register/Register';
import AdminDashboard from './Pages/AdminDashboard/AdminDashboard';
import Profile from './Pages/EventProfile/Profile';

import './App.css';

const clientId: string = process.env.REACT_APP_GOOGLE_CLIENT_ID ?? '';
const socketURL = process.env.REACT_APP_BAS_URL ?? 'http://localhost:4000'
const socket = io(socketURL, { transports: ['websocket'] });

function App() {

  // const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(socket.connected);
  const [lastPong, setLastPong] = useState<string>('');

  useEffect(() => {
    // setSocket(socket);
    // socket.connect();
    // socket.on('connect', () => {
    //   console.log('connected to socket');
    // })
    socket.on('connect', () => {
      setIsConnected(true);
    });
    socket.on('disconnect', () => {
      setIsConnected(false);
    });
    socket.on('pong', () => {
      setLastPong(new Date().toISOString());
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('pong');
    };
  }, []);

  const sendPing = () => {
    socket.emit('ping');
  }

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <Provider store={store}>
        <BrowserRouter>
          <Navbar socket={socket} />
          <Routes>
            <Route path="/" element={<Home socket={socket} />} />
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Home socket={socket} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin" element={<AdminDashboard socket={socket} />} />
            <Route path='/profile' element={<Profile />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    </GoogleOAuthProvider>
  );
}

export default App;
