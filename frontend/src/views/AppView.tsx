import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from '../Pages/Home/Home';
import Navbar from '../Components/Navbar/Navbar';
import AdminDashboard from '../Pages/AdminDashboard/AdminDashboard';
import Profile from '../Pages/EventProfile/Profile';
import NotFound from '../Pages/NotFound/NotFound';
import ProtectedAdminRoute from '../Components/Shared/ProtectedAdminRoute/ProtectedAdminRoute';

import { SocketContext, socket } from '../store/socketContext';
import { useMySelector } from '../hooks/useReduxHooks';
import { RootState } from '../store/store';

import './AppView.css';
import { Socket } from 'socket.io-client';


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
    if (id && displayName) {
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
    <SocketContext.Provider value={socket}>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/admin"
            element={
              <ProtectedAdminRoute>
                <AdminDashboard />
              </ProtectedAdminRoute>
            }
          />
          <Route path='/profile' element={<Profile />} />
          <Route path='/*' element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </SocketContext.Provider>
  );
}

export default AppView;
