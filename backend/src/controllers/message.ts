import mongoose from "mongoose";
import { Message, Event, User } from "../models";
import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import UserInterface from '../interfaces/userInterface';

type Message = {
    _id: string,
    text: string,
    username: string,
    userId: string,
    date: string,
    answered: boolean,
}

const fetchMessages = async (req: Request, res: Response, next: NextFunction) => {
    const eventId = req.params.eventId;
    console.log('event id ' + eventId);
    try {
        Event
            .findById(eventId)
            .populate('messages')
            .exec((err: any, event: any) => {
                if (err) {
                    return next(new Error('Could not find event: ' + err));
                }
                if (!event) {
                    return next(new Error('Event not found'));
                }
                const messages = event.messages.map((message: Message) => {
                    return {
                        id: message._id,
                        text: message.text,
                        username: message.username,
                        userId: message.userId,
                        date: message.date,
                        answered: message.answered,
                    };
                });
                return res.status(200).json({ messages, });
            })
    } catch (err) {
        return next(new Error('Could not fetch messages: ' + err));
    }
}

const sendMessage = async (req: Request, res: Response, next: NextFunction) => {
    const { evid, username, text, userId, date } = req.body;
    let event;
    try {
        event = await Event.findById(evid).populate('attendees messages');
    } catch (err) {
        return next(new Error('Could not find event by id: ' + err));
    }

    // check if is attendee
    if (!event.attendees.some((user: UserInterface) => user._id.toString() === userId)) {
        return next(new Error('User is not an attendee'));
    }

    //create message
    const newMessage = new Message({
        username,
        userId,
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

const answerMessage = async (req: Request, res: Response, next: NextFunction) => {
    const { messageId } = req.body;
    console.log(messageId);
    Message
        .findById(messageId)
        .exec((err: any, message: any) => {
            if (err) {
                return next(new Error('Error finding message: ' + err));
            }
            if (!message) {
                return next(new Error('Message not found'));
            }
            message.answered = true;
            message.save();
            res.json({ message: 'Message answered!', success: true });
        })
}

const restoreMessage = async (req: Request, res: Response, next: NextFunction) => {
    const { messageId } = req.body;
    console.log(messageId);
    Message
        .findById(messageId)
        .exec((err: any, message: any) => {
            if (err) {
                return next(new Error('Error finding message: ' + err));
            }
            if (!message) {
                return next(new Error('Message not found'));
            }
            message.answered = false;
            message.save();
            res.json({ message: 'Message restored!', success: true });
        })
}

const deleteMessage = async (req: Request, res: Response, next: NextFunction) => {
    const { messageId } = req.params;
    const { eventId } = req.body;
    console.log(messageId, eventId);
    let event;
    try {
        event = await Event.findById(eventId).populate('messages');
    } catch (err) {
        return next(new Error('Could not find event by id: ' + err));
    }

    // check if message is in event
    if (!event.messages.some((message: Message) => message._id.toString() === messageId)) {
        return next(new Error('Message not found'));
    }

    // Transaction
    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await Message.findByIdAndDelete(messageId, { session: sess });
        event.messages = event.messages.filter((message: Message) => message._id.toString() !== messageId);
        await event.save({ session: sess });
        await sess.commitTransaction();
    } catch (err) {
        return next(new Error(`DB transaction failed: ${err}`));
    }

    // Send Response
    res.json({ message: 'Message deleted!', success: true });
}

export default {
    fetchMessages,
    sendMessage,
    answerMessage,
    restoreMessage,
    deleteMessage,
}