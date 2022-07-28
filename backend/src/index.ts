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
    userJoin,
    getCurrentUser,
    userLeave,
    getEventUsers
} from './utils/usersManager'
import { msgRouter } from "./routes/message";
import { eventRouter } from "./routes/event";
import { Message } from "./models/messages";
import { Event } from "./models/events";
import { User } from "./models/users";


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
// app.use((error, req, res, next) => {
//     console.log('An error occured:', error);
//     res.json({ message: error.message || 'An unknown error occured.', error: true });
// });

// const chatAdmin = 'SW admin';
app.use('/auth', authRouter);
app.use('/messages', msgRouter);
app.use('/events', eventRouter);

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
io.sockets.on('connection', socket => {
    console.log(`Client with id ${socket.id} connected`);

    //When user joins
    socket.on('joinEvent', async ({ displayName, title }) => {
        const user = userJoin(socket.id, displayName, title);
        socket.join(user.eventTitle);

        const currentEvent = await Event.findOne({ title }).populate('createdBy');
        const { _id: adminId, displayName: chatAdmin } = currentEvent.createdBy;

        const welcomeMessage = formatMessage(chatAdmin, `Welcome to the SW chat system, ${user.displayName}`);
        const adminJoinMessage = formatMessage(chatAdmin, `${user.displayName} has joined the chat`);

        // Welcome user
        socket.emit('welcome message', welcomeMessage);

        //save join message to db
        const newAdminMessage = new Message({
            userId: adminId,
            username: chatAdmin,
            text: adminJoinMessage.text,
            event: currentEvent._id,
            date: adminJoinMessage.time,
        });
        console.log(newAdminMessage);
        await newAdminMessage.save();

        //Broadcast that user joined
        socket.broadcast
            .to(user.eventTitle)
            .emit(
                'fetch event data',
            );

    });

    socket.on('leave event', async ({ eventId, userId }) => {
        const user = userLeave(socket.id);
        socket.leave(user.eventTitle);

        const currentEvent = await Event.findById(eventId).populate('createdBy');
        const { _id: adminId, displayName: chatAdmin } = currentEvent.createdBy;

           //save leave message to db
        const adminLeaveMessage = formatMessage(chatAdmin, `${user.displayName} has left the chat`);
        const newAdminMessage = new Message({
            userId: adminId,
            username: chatAdmin,
            text: adminLeaveMessage.text,
            event: currentEvent._id,
            date: adminLeaveMessage.time,
        });
        await newAdminMessage.save();
        console.log(newAdminMessage);
        // broadcast after user left
        socket.broadcast
            .to(user.eventTitle)
            .emit(
                'fetch event data',
            );
    });

    //Listen for chat msgs
    socket.on('chatMsg', (msg: string) => {

        const user = getCurrentUser(socket.id);

        io.in(user.eventTitle).emit('fetch messages');
    });

    //Runs when client disconnects
    socket.on('disconnect', async () => {
        // console.log(`user id ${socket.id} disconnected`);
        // const user = userLeave(socket.id);

        // const chatAdmin = await Event.findById(user.eventTitle).populate('createdBy');
        // const adminLeaveMessage = formatMessage(chatAdmin, `${user.displayName} has left the chat`);

        // //save join message to db
        // const newAdminMessage = new Message({
        //     userId: chatAdmin._id,
        //     username: chatAdmin,
        //     text: adminLeaveMessage.text,
        //     event,
        //     date: adminLeaveMessage.time,
        // });
        // await newAdminMessage.save();

        // if (user) {
        //     io.in(user.eventTitle)
        //         .emit('message', formatMessage(chatAdmin, `User ${user.displayName} has left the chat`));

        //     //resend users and room info
        //     io.in(user.eventTitle).emit('fetch event data');
        // }
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