import express from "express";
import session from "express-session";
import cors from "cors";
import 'dotenv/config';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import { authRouter } from "./routes/auth";
import passport from "passport";
import './utils/googleAuth';

//init
const app = express();
const db_url = process.env.DB_URL;
const PORT = process.env.PORT;
const cors_origin = process.env.CORS_ORIGIN;

mongoose.connect(db_url, {}).then(() => {
    console.log('Connected to database');
}).catch(err => {
    console.log('DB Error: ', err);
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

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.listen(PORT, () => {
    console.log('Server is running on port: ' + PORT);
})