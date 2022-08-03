import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { Event, User } from '../models';
import Message from '../interfaces/messageInterface'

const getEventsByCreator = async (req: Request, res: Response, next: NextFunction) => {
    const createdBy = req.params.createdBy;
    console.log(createdBy);
    Event
        .find({ createdBy })
        .populate("attendees polls createdBy")
        .exec((err: any, events: any) => {
            if (err) {
                return next(err);
            }
            if (!events) {
                return res.status(404).json({ message: 'Events not found' });
            }
            const modifiedEvents = events.map((event: any) => {
                const attendees = event.attendees.map((attendee: any) => {
                    return {
                        id: attendee._id,
                        displayName: attendee.displayName,
                        email: attendee.email,
                        vpoints: attendee.vpoints,
                    };
                });
                const polls = event.polls.map((poll: any) => {
                    return {
                        id: poll._id,
                        title: poll.title,
                        description: poll.description,
                        options: poll.options,
                        voted: poll.voted,
                    };
                });
                return {
                    id: event._id,
                    title: event.title,
                    description: event.description,
                    attendees,
                    polls,
                    host: event.createdBy.displayName,
                    date: event.createdAt,
                    archived: event.archived,
                }
            });
            res.status(200).json({ events: modifiedEvents });
        });
};

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
        attendees: [],
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
            if (index === -1) {
                event.attendees.push(userId);
            }
            await event.save();
            return res.status(200).json({ message: `User ${event.attendees[index].displayName} joined event`, evid: event._id, eventTitle: event.title });
        })
        .catch((err: any) => {
            return next(new Error('Could not join event: ' + err));
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
            const attendees = event.attendees.map((attendee: any) => {
                return {
                    id: attendee._id,
                    displayName: attendee.displayName,
                    email: attendee.email,
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

const editEvent = async (req: Request, res: Response, next: NextFunction) => {
    const eventId = req.params.eventId;
    const { title, description } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        return res.status(401).send({ message: 'Invalid fields sent' });
    }
    try {
        const event = await Event.findByIdAndUpdate(eventId, { title, description }, { returnDocument: 'after', lean: true });
        res.status(200).json({
            message: 'Event edited successfully',
            event
        })
    } catch (err) {
        return next(new Error('Could not edit event: ' + err));
    }
}

const archiveEvent = async (req: Request, res: Response, next: NextFunction) => {
    const { eventId } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        return res.status(401).send({ message: 'Invalid fields sent' });
    }
    try {
        Event
            .findById(eventId)
            .exec(async (err: any, event: any) => {
                if (err) {
                    return next(new Error('Could not find event: ' + err));
                }
                if (!event) {
                    return next(new Error('Event not found'));
                }
                event.archived = true;
                await event.save();
                res.status(200).json({ message: 'Event deleted successfully' });
            });
    } catch (err) {
        return next(new Error('Could not delete event: ' + err));
    }

    res.json({
        message: 'Event deleted successfully',
    })
}

const updateVpoints = async (req: Request, res: Response, next: NextFunction) => {
    const { userId, vpoints } = req.body;

    try {
        User
            .findById(userId)
            .exec(async (err: any, user: any) => {
                if (err) {
                    return next(new Error('Error finding user: ' + err));
                }
                if (!user) {
                    return next(new Error('User not found'));
                }
                user.vpoints = vpoints;
                await user.save();
                const modifiedUser = {
                    id: user._id,
                    displayName: user.displayName,
                    email: user.email,
                    vpoints: user.vpoints,
                }
                res.status(200).json(modifiedUser);
            });
    } catch (err) {
        return next(new Error('Could not update vpoints: ' + err));
    }
}

const deleteEvent = async (req: Request, res: Response, next: NextFunction) => {
    const { eventId } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        return res.status(401).send({ message: 'Invalid fields sent' });
    }
    try {
        Event
            .findById(eventId)
            .exec(async (err: any, event: any) => {
                if (err) {
                    return next(new Error('Could not find event: ' + err));
                }
                if (!event) {
                    return next(new Error('Event not found'));
                }
                event.deleted = true;
                await event.save();
                res.status(200).json({ message: 'Event deleted successfully' });
            });
    } catch (err) {
        return next(new Error('Could not delete event: ' + err));
    }

    res.json({
        message: 'Event deleted successfully',
    })
}

export default {
    getEventsByCreator,
    fetchEventData,
    createEvent,
    joinEvent,
    archiveEvent,
    updateVpoints,
    deleteEvent,
}