import { Router } from "express";
import auth from '../controllers/auth';
import { body } from "express-validator";

export const authRouter = Router();

authRouter.post('/register', 
body('email').isEmail().withMessage('Email must be valid'),
body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
body('firstName').isLength({ min: 1 }).withMessage('First name is required'),
body('lastName').isLength({ min: 1 }).withMessage('Last name is required'),
auth.register);

authRouter.post('/login',
    body('email').isEmail(),
    body('password').isLength({ min: 8 }),
    auth.login);

authRouter.post('/google', auth.googleLogin);
