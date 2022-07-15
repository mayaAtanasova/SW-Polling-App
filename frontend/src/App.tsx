import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './Pages/Home/Home';
import Navbar from './Components/Navbar/Navbar';
import Login from './Pages/Login/Login';
import Register from './Pages/Register/Register';
import AdminDashboard from './Pages/AdminDashboard/AdminDashboard';
import { Provider } from 'react-redux';
import store from './store/store';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Profile from './Pages/Profile/Profile';

const clientId: string = process.env.REACT_APP_GOOGLE_CLIENT_ID ?? '';

function App() {
  return (
    <GoogleOAuthProvider clientId={clientId}>
    <Provider store={store}>
    <BrowserRouter>
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/logout" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/admin" element={<AdminDashboard />} />
      < Route path='/profile' element={<Profile />} />
    </Routes>
    </BrowserRouter>
    </Provider>
    </GoogleOAuthProvider>
  );
}

export default App;
