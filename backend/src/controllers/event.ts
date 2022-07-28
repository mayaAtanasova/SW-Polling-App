import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { Event, User } from '../models';
import UserInterface from '../utils/userInterface';

type Message = {
    _id: string,
    text: string,
    username: string,
    date: string
}

const createEvent = async (req: Request, res: Response, next: NextFunction) => {
    const { title, userId } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        return res.status(401).send({ message: 'Invalid fields sent' });
    }
    const newEvent = new Event({
        title,
        members: [],
        messages: [],
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
    console.log(title, ' , ', userId);
    Event
    .findOne({ title })
    .then((event: any) => {
        event.attendees.push(userId);
        event.save();
        return res.status(200).json({ message: 'User joined event successfully', evid: event._id });
    })
    .catch((err: any) => {
        return next(new Error('Could not join event: ' + err));
    });
};

const fetchEventData = async (req: Request, res: Response, next: NextFunction) => {
    const evid = req.params.evid;
    Event
    .findById(evid)
    .populate("attendees messages")
    .exec((err: any, event: any) => {
        if (err) {
            return next(new Error('Could not join event: ' + err));
        }
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        const attendees = event.attendees.map((attendee: any) => {
            return {
                id: attendee._id,
                displayName: attendee.displayName,
            };
        });
        const messages = event.messages.map((message: Message) => {
            return {
                id: message._id,
                text: message.text,
                username: message.username,
                date: message.date,
            };
        });
        const modifiedEvent = {
            id: event._id,
            title: event.title,
            attendees,
            messages,
        }
        return res.status(200).json({ message: 'User joined event successfully', event: modifiedEvent });
    });
}

const leaveEvent = (req: Request, res: Response, next: NextFunction) => {
    const { eventId, userId } = req.body;
    const event = Event.findById((eventId), async (err: any, event: any) => {
        console.log('event: ', event);
        if (err) {
            return next(new Error('Could not leave event: ' + err));
        }
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        event.attendees = event.attendees.filter((item: any) => item.toString() !== userId);
        // console.log('event after leave', event);
        await event.save();
        return res.status(200).json({ message: 'User left event successfully' });
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
    leaveEvent,
    deleteEvent,
}