import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { Event, User } from '../models';
import Message from '../interfaces/messageInterface'


const createEvent = async (req: Request, res: Response, next: NextFunction) => {
    const { title, description, userId } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        return res.status(401).send({ message: 'Invalid fields sent' });
    }
    const newEvent = new Event({
        title,
        description,
        members: [],
        messages: [],
        voted: [],
        createdBy: userId,
    });

    try {
        await newEvent.save();
    } catch (err) {
        return next(new Error('Could not create event: ' + err));
    }

    res.status(200).json({
        message: 'Event created successfully',
        event: newEvent,
    })
}

const joinEvent = async (req: Request, res: Response, next: NextFunction) => {

    const { title, userId } = req.body;

    Event
        .findOne({ title })
        .populate('attendees')
        .then(async (event: any) => {
            const index = event.attendees.findIndex((attendee: any) => attendee._id.toString() === userId);
            if (index !== -1) {
                return res.status(401).json({ message: `User ${event.attendees[index].displayName} joined event`, evid: event._id, eventTitle: event.title });
            }
            event.attendees.push(userId);
            await event.save();
            User.findById(userId, (err: any, user: any) => {
                if (err) {
                    return next(new Error('Could not find user: ' + err));
                }
                if (!user) {
                    return next(new Error('User not found'));
                }
                return res.status(200).json({ message: `${user.displayName} joined event`, evid: event._id, eventtitle: event.title });
            })
                .catch((err: any) => {
                    return next(new Error('Could not join event: ' + err));
                });
        });
    }

    const fetchEventData = async (req: Request, res: Response, next: NextFunction) => {
        const evid = req.params.evid;
        Event
            .findById(evid)
            .populate("attendees messages createdBy")
            .exec((err: any, event: any) => {
                if (err) {
                    return next(new Error('Could not join event: ' + err));
                }
                if (!event) {
                    return res.status(404).json({ message: 'Event not found' });
                }
                console.log(event);
                const attendees = event.attendees.map((attendee: any) => {
                    return {
                        id: attendee._id,
                        displayName: attendee.displayName,
                        vpoints: attendee.vpoints,
                    };
                });

                const messages = event.messages.map((message: Message) => {
                    return {
                        id: message._id,
                        text: message.text,
                        username: message.username,
                        userId: message.userId,
                        date: message.date,
                    };
                });
                const modifiedEvent = {
                    id: event._id,
                    title: event.title,
                    description: event.description,
                    attendees,
                    messages,
                    host: event.createdBy.displayName
                }
                return res.status(200).json({ message: 'User joined event successfully', event: modifiedEvent });
            });
    }

    const deleteEvent = async (req: Request, res: Response, next: NextFunction) => {
        const { evid } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log(errors);
            return res.status(401).send({ message: 'Invalid fields sent' });
        }
        try {
            await Event.findByIdAndDelete(evid);
        } catch (err) {
            return next(new Error('Could not delete event: ' + err));
        }

        res.json({
            message: 'Event deleted successfully',
        })
    }

    export default {
        fetchEventData,
        createEvent,
        joinEvent,
        deleteEvent,
    }