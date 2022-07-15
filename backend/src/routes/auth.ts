import { Router } from "express";
import auth from '../controllers/auth';
import passport from "passport";

export const authRouter = Router();

authRouter.post('/register', auth.register);

authRouter.post('/login', auth.login);

authRouter.post('/google', auth.googleLogin);
