import mongoose from "mongoose";
import { Message, Event, User } from "../models";
import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';


const fetchMessages = async (req: Request, res: Response, next: NextFunction) => {
    const { evid } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        return next(new Error('Invalid fields sent'));
    }
    try {
        const event = await Event.findById(evid);
        if (!event) {
            return next(new Error('Event not found'));
        }
        const messages = await Message.find({ event: evid });
        res.json({
            message: 'Messages fetched successfully',
            messages,
        })
    } catch (err) {
        return next(new Error('[Could not fetch messages: ' + err));
    }
}

const sendMessage = async (req: Request, res: Response, next: NextFunction) => {
    const { evid, displayName, text, userId, date } = req.body;
    let event;
    try {
        event = await Event.findById(evid);
    } catch (err) {
        return next(new Error('[Could not find event by id: ' + err));
    }

    // add a new attendee
    let user;
    try {
        user = await User.findById(userId);
    } catch (err) {
        return next(new Error('[Could not find user by id: ' + err));
    }

    const isAttendee = event.attendees.any((attendee: any) => attendee._id === userId);
    if (!isAttendee) {
        event.attendees.push(user);
    }

    //create message
    const newMessage = new Message({
        username: displayName,
        text,
        event: evid,
        date
    });
    // Transaction
    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await newMessage.save({ session: sess });
        event.messages.push(newMessage);
        await event.save({ session: sess });
        await sess.commitTransaction();
    } catch (err) {
        return next(new Error(`DB transaction failed: ${err}`));
    }

    // Send Response
    res.json({ message: 'Message sent!' });
}

export default {
    fetchMessages,
    sendMessage
}