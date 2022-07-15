import express from "express";
import http from "http";
import cors from "cors";
import 'dotenv/config';
import mongoose from 'mongoose';
import { authRouter } from "./routes/auth";
import './utils/googleAuth';
import { Server } from 'socket.io';
import formatMessage from './utils/messageFormatter';
import {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
} from './utils/usersManager'
import { msgRouter } from "./routes/message";
import { eventRouter } from "./routes/event";


//init
const app = express();
const server = http.createServer(app);
const db_url = process.env.DB_URL;
const PORT = process.env.PORT;
const cors_origin = process.env.CORS_ORIGIN;
const chatAdmin = 'SW admin';

const io = new Server(server)

mongoose.connect(db_url, {}).then(() => {
    console.log('Connected to database');
}).catch(err => {
    console.log('DB Error: ', err);
});

//Runs when a client connects to chat
io.on('connection', socket => {
    console.log(`Usesr with id ${socket.id} connected`);

    //When user joins
    socket.on('joinRoom', ({ displayName, room }) => {
        const user = userJoin(socket.id, displayName, room);
        socket.join(user.room);
        
        // Welcome user
        socket.emit('message', formatMessage(chatAdmin, `Welcome to the StreamWorks chat system!`))

        //Broadcast that user joined
        socket.broadcast
            .to(user.room)
            .emit(
                'message',
                formatMessage(chatAdmin, `User ${user.displayName} has joined this chat.`)
            );
        
            //Send users and room info
            io.in(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room),
            });
    });

    //Listen for chat msgs
    socket.on('chatMsg', (msg:string) => {

        const user = getCurrentUser(socket.id);

        io.in(user.room).emit('message', formatMessage(user.displayName, msg));
    });

    //Runs when client disconnects
    socket.on('disconnect', () => {
        console.log(`user id ${socket.id} disconnected`);
        const user = userLeave(socket.id);

        if (user) {
            io.in(user.room)
            .emit('message', formatMessage(chatAdmin, `User ${user.displayName} has left the chat`));

            //resend users and room info
            io.in(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room),
            })
        }
    });
});

//middleware
app.use(express.json());
app.use(cors(
    {
        origin: '*',
        credentials: true,
    }
));

app.use('/auth', authRouter);
app.use('/messages', msgRouter);
app.use('/events', eventRouter);

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.listen(PORT, () => {
    console.log('Server is running on port: ' + PORT);
})