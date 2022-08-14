import { createContext } from 'react';
import io from 'socket.io-client';

const socketURL = process.env.REACT_APP_BAS_URL ?? 'http://localhost:4000'

export const socket = io(socketURL, { transports: ['websocket'] });
export const SocketContext = createContext(socket);