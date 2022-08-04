import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import io from 'socket.io-client';

import Home from '../Pages/Home/Home';
import Navbar from '../Components/Navbar/Navbar';
import AdminDashboard from '../Pages/AdminDashboard/AdminDashboard';
import Profile from '../Pages/EventProfile/Profile';
import { useMySelector } from '../hooks/useReduxHooks';

import './AppView.css';
import { RootState } from '../store/store';

const socketURL = process.env.REACT_APP_BAS_URL ?? 'http://localhost:4000'
const socket = io(socketURL, { transports: ['websocket'] });

const AppView = () => {

  const { user, isAuthenticated } = useMySelector((state: RootState) => state.auth);
  const [isConnected, setIsConnected] = useState<boolean>(socket.connected);
  const [lastPong, setLastPong] = useState<string>('');
  const { id, displayName } = user!;

  useEffect(() => {
    socket.on('connect', () => {
      setIsConnected(true);
      console.log(isConnected);
    });
    socket.on('disconnect', () => {
      setIsConnected(false);
    });
    socket.on('pong', () => {
      setLastPong(new Date().toISOString());
    });
    if(id && displayName) {
        socket.emit('new user', id, displayName);
    }

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
        <BrowserRouter>
          <Navbar socket={socket}/>
          <Routes>
            <Route path="/" element={<Home socket={socket} />} />
            <Route path="/admin" element={<AdminDashboard socket={socket} />} />
            <Route path='/profile' element={<Profile socket={ socket }/>} />
          </Routes>
        </BrowserRouter>
  );
}

export default AppView;
