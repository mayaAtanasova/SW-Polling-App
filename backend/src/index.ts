import express from "express";
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
    userLeave,
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

// const chatAdmin = 'SW admin';
app.use('/auth', authRouter);
app.use('/messages', msgRouter);
app.use('/events', eventRouter);
app.use('/polls', pollsRouter);

app.use('/', (req, res) => {
    res.send('Hello World');
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
        console.log(`${displayName} connected to the chat system`);
        const user = addUser(socket.id, userId, displayName);
    })

    //When user joins event
    socket.on('joinEvent', async ({ userId, displayName, title }) => {
        const user = userJoinEvent(socket.id, userId, displayName, title);
        socket.join(user.eventTitle);

        //get users to fetch the event data
        const users = getEventUsers(title);
        users.forEach(user => {
            io.to(user.sid).emit('fetch event data', title);
        })
    });

    //Listen for chat msgs
    socket.on('chat message', (userId, title) => {
        const users = getEventUsers(title);

        //Broadcast to room to get data
        users.forEach(user => {
            io.to(user.sid).emit('fetch messages', title);
        })
    });

    //Runs when client disconnects
    socket.on('disconnect', async () => {
        console.log(`user id ${socket.id} disconnected`);
        const user = userLeave(socket.id);
        if (user) {
            const event = user.eventTitle;

            const currentEvent = await Event.findOne({ event }).populate('createdBy');
            const { _id: adminId, displayName: chatAdmin } = currentEvent.createdBy;

            const adminLeaveMessage = formatMessage(chatAdmin, `${user.displayName} has left the chat`);

            io.in(user.eventTitle)
                .emit('leave message', adminLeaveMessage);
        }
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