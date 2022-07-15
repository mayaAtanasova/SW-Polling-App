import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { Event } from '../models';
import UserInterface from '../utils/userInterface';


const fetchEventData = async (req: Request, res: Response, next: NextFunction) => {
    const { evid } = req.body;

    let event;

    try {
        event = await Event.findById(evid).populate('members messages');
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
    } catch (err) {
        return next(new Error('[Could not fetch event by id: ' + err));
    }

    const attendees = event.attendees.map((attendee: UserInterface) => {
        return {
            id: attendee._id,
            displayName: attendee.displayName,
            email: attendee.email,
            role: attendee.role,
            vpoints: attendee.vpoints,
        };
    })

    res.json({
        message: 'Event fetched successfully',
        messages: event.messages,
        attendees
    })

}

const createEvent = async (req: Request, res: Response, next: NextFunction) => {
    const { title } = req.body;
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        console.log(errors);
        return res.status(401).send({ message: 'Invalid fields sent' });
    }
    const newEvent = new Event({
        title,
        members: [],
        messages: [],
    });

    try {
        await newEvent.save();
    } catch (err) {
        return next(new Error('[Could not create event: ' + err));
    }

    res.json({
        message: 'Event created successfully',
        event: newEvent,
    })
}

const deleteEvent = async (req: Request, res: Response, next: NextFunction) => {
    const { evid } = req.body;
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        console.log(errors);
        return res.status(401).send({ message: 'Invalid fields sent' });
    }
    try {
        await Event.findByIdAndDelete(evid);
    } catch (err) {
        return next(new Error('[Could not delete event: ' + err));
    }

    res.json({
        message: 'Event deleted successfully',
    })
}

export default {
    fetchEventData,
    createEvent,
    deleteEvent,
}