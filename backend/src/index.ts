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
    getEventUsers
} from './utils/usersManager'
import { msgRouter } from "./routes/message";
import { eventRouter } from "./routes/event";
import { Message } from "./models/messages";


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
    socket.on('joinEvent', async ({ displayName, event }) => {
        const user = userJoin(socket.id, displayName, event);
        socket.join(user.event);

        const welcomeMessage = formatMessage(chatAdmin, `Welcome to the SW chat system, ${user.displayName}`);
        const adminJoinMessage = formatMessage(chatAdmin, `${user.displayName} has joined the chat`);

        // Welcome user
        socket.emit('welcome message', welcomeMessage);

        //save join message to db
        const newMessage = new Message({
            userId: '1',
            username: chatAdmin,
            text: adminJoinMessage.text,
            event,
            date: adminJoinMessage.time,
        });
        await newMessage.save();

        //Broadcast that user joined
        socket.broadcast
            .to(user.event)
            .emit(
                'fetch event data',
            );

    });

    //Listen for chat msgs
    socket.on('chatMsg', (msg: string) => {

        const user = getCurrentUser(socket.id);

        io.in(user.event).emit('fetch messages');
    });

    //Runs when client disconnects
    socket.on('disconnect', () => {
        console.log(`user id ${socket.id} disconnected`);
        const user = userLeave(socket.id);

        if (user) {
            io.in(user.event)
                .emit('message', formatMessage(chatAdmin, `User ${user.displayName} has left the chat`));

            //resend users and room info
            io.in(user.event).emit('fetch event data');
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