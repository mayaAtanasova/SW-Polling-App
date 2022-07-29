import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import socketIOClient, { Socket } from 'socket.io-client';

import { Provider } from 'react-redux';
import store from './store/store';

import Home from './Pages/Home/Home';
import Navbar from './Components/Navbar/Navbar';
import Login from './Pages/Login/Login';
import Register from './Pages/Register/Register';
import AdminDashboard from './Pages/AdminDashboard/AdminDashboard';
import Profile from './Pages/Profile/Profile';
import Chat from './Components/Chat/Messages';

import './App.css';

const clientId: string = process.env.REACT_APP_GOOGLE_CLIENT_ID ?? '';
const socketURL = process.env.REACT_APP_BAS_URL ?? 'http://localhost:4000'

function App() {

  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socket = socketIOClient(socketURL, { transports: ['websocket'] });
    setSocket(socket);
  }, []);

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <Provider store={store}>
        <BrowserRouter>
          <Navbar socket={socket} />
          <Routes>
            <Route path="/" element={<Home socket={socket}/>} />
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Home socket={socket}/>} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin" element={<AdminDashboard />} />
            < Route path='/profile' element={<Profile />} />
            {/* <Route path="/event" element={<Chat socket={socket}/>} /> */}
          </Routes>
        </BrowserRouter>
      </Provider>
    </GoogleOAuthProvider>
  );
}

export default App;
