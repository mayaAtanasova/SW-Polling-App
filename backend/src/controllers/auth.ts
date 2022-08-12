import { User } from '../models';
import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import UserInterface from '../interfaces/userInterface';
import { issueJwt, verifyJwt } from '../utils/jwt';
import { validationResult } from 'express-validator';

const register = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password, firstName, lastName, role } = req.body; //voting points to be added later
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        return res.status(401).send({ message: 'Invalid fields sent' });
    }
    const displayName = firstName + ' ' + lastName;
    const hashedp = bcrypt.hashSync(password, 10);

    const newUser = new User({
        email,
        hashedp,
        displayName,
        firstName,
        lastName,
        role,
    });
    //check for duplicate email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        const error = new Error('Email is taken, please proceed to login');
        return res.status(401).send({ message: 'Email is taken, please proceed to login' });
    }

    newUser.save((err: Error, user: UserInterface) => {
        if (err) {
            console.log('Error creating user: ', err);
            return res.status(500).send(err);
        }
        const token = issueJwt(user._id, user.displayName, user.role, user.vpoints);
        res.status(200).send({
            token,
            message: 'User successfully registered'
        });
    })

};

const login = (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body; //voting points to be added later
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        return res.status(401).send({ message: 'Invalid fields sent' });
    }
    User.findOne({ email }, (err: Error, user: UserInterface) => {
        if (err) {
            console.log('Error finding user: ', err);
            res.status(500).send(err);
            return;
        }
        if (!user
            || !user.hashedp
            || !bcrypt.compareSync(password, user.hashedp)) {
            res.status(401).send({ message: 'Invalid email or password', user: null });
            return;
        }
        const token = issueJwt(user._id, user.displayName, user.role, user.vpoints);
        res.status(200).send({
            token,
            message: 'User successfully logged in'
        });
    })
};

const googleLogin = async (req: Request, res: Response) => {
    const { email, firstName, lastName, displayName, role } = req.body; //voting points to be added later

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        const token = issueJwt(existingUser._id, existingUser.displayName, existingUser.role, existingUser.vpoints);
        return res.status(200).send({
            token,
            message: 'User successfully authorized'
        });
    }

    const newUser = new User({
        email,
        displayName,
        firstName,
        lastName,
        role,
    });
    newUser.save((err: Error, user: UserInterface) => {
        if (err) {
            console.log('Error creating user: ', err);
            return res.status(500).send(err);
        }
        const token = issueJwt(user._id, user.displayName, user.role, user.vpoints);
        res.status(200).send({
            token,
            message: 'User successfully authorized'
        });
    })

};

const verifyUser = async (req: Request, res: Response, next: NextFunction) => {
    const { id, token } = req.body;
    // Find user with id
    let user;
    try {
        user = await User.findById(id);
    } catch (error) {
        return next(new Error('Could not find user by id: ' + error));
    }

    // Verify Token
    const tokenIsValid = verifyJwt(id, token);
    if (!tokenIsValid) {
        return res.json({ message: 'Access denied, invalid token.', access: false });
    }

    // Send response
    res.status(200).json({
        message: 'Successful authorization.',
        access: true
    });
}

export default {
    register,
    login,
    googleLogin,
    verifyUser
}