import express, { Request, Response, NextFunction } from "express";
import http from "http";
import cors from "cors";
import 'dotenv/config';
import mongoose from 'mongoose';
import { authRouter } from "./routes/auth";
import './utils/googleAuth';
import { Server, Socket } from 'socket.io';
import formatMessage from './utils/messageFormatter';
import {
    addUser,
    userJoinEvent,
    getCurrentUser,
    userLeaveEvent,
    userDisconnect,
    getEventUsers
} from './utils/usersManager'
import { msgRouter } from "./routes/message";
import { eventRouter } from "./routes/event";
import { Message } from "./models/messages";
import { Event } from "./models/events";
import { User } from "./models/users";
import { pollsRouter } from "./routes/polls";


//init
const app = express();
const db_url = process.env.DB_URL;
const PORT = process.env.PORT;
const cors_origin = process.env.CORS_ORIGIN;

//middleware
app.use(express.json());
app.use(cors(
    {
        origin: '*',
        credentials: true,
    }
));

// Error Handler
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
    console.log('An error occured:', error);
    res.json({ message: error.message || 'An unknown error occured.', error: true });
});

// const chatAdmin = 'SW admin';
app.use('/auth', authRouter);
app.use('/messages', msgRouter);
app.use('/events', eventRouter);
app.use('/polls', pollsRouter);

app.use('/', (req, res) => {
    res.send({ message: 'app is operational' });
});

//socket.io
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        credentials: true,
    }
});

//Runs when a client connects to chat
io.sockets.on('connect', socket => {
    console.log(`Client with id ${socket.id} connected`);

    //new user appears
    socket.on('new user', (userId, displayName) => {
        console.log(`${displayName} connected to the sw poll system`);
        const user = addUser(socket.id, userId, displayName);
    })

    //When user joins event
    socket.on('join event', async ({ userId, displayName, title }) => {
        console.log(`${displayName} is joining ${title}`);
        const user = userJoinEvent(socket.id, userId, displayName, title);
        socket.join(title);

        //get users to fetch the event data
        const users = getEventUsers(title);
        console.log(users);
        io.to(title).emit('fetch event data', title);
    });

    //Listen for chat msgs
    socket.on('chat message', (userId, title) => {
        console.log('received new message from user ', userId, ' for event ', title);
        const users = getEventUsers(title);
        console.log('current users are: ', users);

        //Broadcast to room to get data
            console.log('broadcasting order to fetch messages')
            io.to(title).emit('fetch messages', title);
    });

    //Listen for new polls
    socket.on('new poll published', title => {
        console.log(`received new poll submission for event ${title}`);
        const users = getEventUsers(title);
        console.log('current users are: ', users);

        //Broadcast to room to get data
            console.log('broadcasting order to fetch polls')
            io.to(title).emit('fetch polls', title);
    })

    //when user votes
    socket.on('user vote', (userId, title, pollId) => {
        console.log(`${userId} voted in poll ${pollId}`);
        const users = getEventUsers(title);
        console.log('current users are: ', users);

        //Broadcast to room to get data
            console.log('broadcasting order to fetch polls')
            io.to(title).emit('fetch polls', title, pollId);
    })


    //When user leaves event
    socket.on('leave event', (userId, title) => {
        if (userId && title) {
            console.log(`${userId} left ${title}`);
            const user = userLeaveEvent(socket.id, title);
            if (user) {
                console.log('user leaving event title: ', user.eventTitle);
                socket.leave(user.eventTitle);
            }
        }
    });

    //Runs when client disconnects
    socket.on('disconnect', async () => {
        console.log(`user id ${socket.id} disconnected`);
    });
});

//initialize db
mongoose.connect(db_url, {}).then(() => {
    console.log('Connected to database');
}).catch(err => {
    console.log('DB Error: ', err);
});

//start server
server.listen(PORT, () => {
    console.log('Server is running on port: ' + PORT);
})