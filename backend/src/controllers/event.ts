import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { Event, User, Poll } from '../models';
import Message from '../interfaces/messageInterface'
import PollInterface from '../interfaces/pollInterface'
import mongoose from 'mongoose';

const getEventsByCreator = async (req: Request, res: Response, next: NextFunction) => {
    const createdBy = req.params.createdBy;
    console.log('Created by ' + createdBy);
    Event
        .find({ createdBy })
        .populate("attendees createdBy")
        .populate([
            {
                path: 'polls',
                select: '_id title type votes concluded deleted',
                populate: {
                    path: 'votes',
                    select: 'option user createdAt',
                    populate: {
                        path: 'user',
                        select: '_id displayName vpoints',
                    }
                }
            },
            {
                path: 'messages',
                select: '_id text username userId date answered',
            }
        ])
        .exec((err: any, events: any) => {
            if (err) {
                return next(err);
            }
            if (!events) {
                return res.status(404).json({ message: 'Events not found' });
            }
            const modifiedEvents = events
            .filter((event: any) => event.deleted === false)
            .map((event: any) => {
                const attendees = event.attendees.map((attendee: any) => {
                    return {
                        id: attendee._id,
                        displayName: attendee.displayName,
                        email: attendee.email,
                        vpoints: attendee.vpoints,
                    };
                });
                return {
                    id: event._id,
                    title: event.title,
                    description: event.description,
                    attendees,
                    polls: event.polls,
                    messages: event.messages,
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
        console.log('Validation errors ' + errors);
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
            if (!event) {
                return res.status(404).json({ message: 'No such event' });
            }
            let index = event.attendees.findIndex((attendee: any) => attendee._id.toString() === userId);
            if (index === -1) {
                event.attendees.push(userId);
                await event.save();
                index = event.attendees.length - 1;
            }
            return res.status(200).json({ message: `User ${event.attendees[index].displayName} joined event`, evid: event._id, eventTitle: event.title });

        })
        .catch((err: any) => {
            console.log('Error in join event ' + err);
            return res.status(404).json({ message: 'Error joing event' });
        });

}

const fetchEventData = async (req: Request, res: Response, next: NextFunction) => {
    const evid = req.params.evid;
    console.log('Event id ' + evid);

    if (!evid || evid === '' || evid === 'undefined') {
        return res.status(404).json({ message: 'No event id provided' });
    }

    Event
        .findById(evid)
        .populate("attendees messages createdBy")
        .populate([
            {
                path: 'polls',
                select: '_id title type votes concluded deleted',
                populate: {
                    path: 'votes',
                    select: 'option user createdAt',
                    populate: {
                        path: 'user',
                        select: '_id displayName vpoints',

                    }
                }
            }
        ])
        .exec((err: any, event: any) => {
            if (err) {
                console.log('Error while fetching event ' + err)
                return res.json({ message: 'No such event' });
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
                    _id: message._id,
                    text: message.text,
                    username: message.username,
                    userId: message.userId,
                    date: message.date,
                    answered: message.answered,
                };
            });

            const modifiedEvent = {
                id: event._id,
                title: event.title,
                description: event.description,
                attendees,
                messages,
                polls: event.polls,
                host: event.createdBy.displayName
            }
            return res.status(200).json({ message: 'Event data fetched', event: modifiedEvent });
        });
}

const fetchEventPolls = async (req: Request, res: Response, next: NextFunction) => {
    const evid = req.params.evid;

    try {
        Event
            .findById(evid)
            .populate([
                {
                    path: 'polls',
                    select: '_id title type votes concluded deleted',
                    populate: {
                        path: 'votes',
                        select: '_id option user createdAt',
                        populate: {
                            path: 'user',
                            select: '_id displayName vpoints',
                        }
                    }
                }
            ])
            .exec((err: any, event: any) => {
                if (err) {
                    return next(new Error('Could not find event: ' + err));
                }
                if (!event) {
                    return next(new Error('No event found'));
                }
                return res.status(200).json({ polls: event.polls })
            })
    } catch (err) {
        return next(new Error('Could not fetch polls: ' + err));
    }
}

const fetchEventAttendees = async (req: Request, res: Response, next: NextFunction) => {
    const evid = req.params.evid;

    try {
        Event
            .findById(evid)
            .populate([
                {
                    path: 'attendees',
                    select: '_id displayName email vpoints',
                }
            ])
            .exec((err: any, event: any) => {
                if (err) {
                    return next(new Error('Could not find event: ' + err));
                }
                if (!event) {
                    return next(new Error('Event not found'));
                }
                const modifiedAttendees = event.attendees.map((attendee: any) => {
                    return {
                        id: attendee._id,
                        displayName: attendee.displayName,
                        email: attendee.email,
                        vpoints: attendee.vpoints,
                    };
                });
                return res.status(200).json({ attendees: modifiedAttendees })
            })
    } catch (err) {
        return next(new Error('Could not fetch attendees: ' + err));
    }
}
const editEvent = async (req: Request, res: Response, next: NextFunction) => {
    const eventId = req.params.eventId;
    const { title, description } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log('Validation errors ' + errors);
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
    const evid = req.params.evid;
    console.log('Event to archive id ' + evid);
    try {
        Event
            .findById(evid)
            .exec(async (err: any, event: any) => {
                if (err) {
                    return next(new Error('Could not find event: ' + err));
                }
                if (!event) {
                    return next(new Error('Event not found'));
                }
                try {
                    // const session = await mongoose.startSession();
                    // session.startTransaction();
                    event.archived = true;
                    event.polls.forEach(async (poll: any) => {
                        await Poll.findByIdAndUpdate(poll._id, { concluded: true });
                    });
                    await event.save();
                    // await session.commitTransaction();
                    res.status(200).json({ message: 'Event archived successfully', success: true });
                } catch (err) {
                    return next(new Error('Could not archive event: ' + err));
                }
            });
        } catch (err) {
            return next(new Error('Could not archive event: ' + err));
        }

}

const restoreEvent = async (req: Request, res: Response, next: NextFunction) => {
    const evid = req.params.evid;
    try {
        Event
            .findById(evid)
            .exec(async (err: any, event: any) => {
                if (err) {
                    return next(new Error('Could not find event: ' + err));
                }
                if (!event) {
                    return next(new Error('Event not found'));
                }
                try {
                    event.archived = false;
                    event.polls.forEach(async (poll: any) => {
                        await Poll.findByIdAndUpdate(poll._id, { concluded: false });
                    });
                    await event.save();
                    res.status(200).json({ message: 'Event restored successfully', success: true });
                } catch (err) {
                    return next(new Error('Could not archive event: ' + err));
                }
            });
    } catch (err) {
        return next(new Error('Could not delete event: ' + err));
    }
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
    const evid = req.params.evid;

    try {
        Event
        .findById(evid)
        .exec(async (err: any, event: any) => {
            if (err) {
                return next(new Error('Could not find event: ' + err));
            }
            if (!event) {
                return next(new Error('Event not found'));
            }
            if(!event.archived) {
                return next(new Error('Cannot delete an active event'));
            }
            try{
                event.deleted = true;
                event.polls.forEach(async (poll: any) => {
                    await Poll.findByIdAndUpdate(poll._id, { deleted: true });
                });
                await event.save();
                res.status(200).json({ message: 'Event deleted successfully', success: true });
            } catch {
                return next(new Error('Could not delete event: ' + err));
            }
        });
    } catch (err) {
        return next(new Error('Could not delete event: ' + err));
    }
}

export default {
    getEventsByCreator,
    fetchEventData,
    fetchEventPolls,
    fetchEventAttendees,
    createEvent,
    joinEvent,
    archiveEvent,
    restoreEvent,
    updateVpoints,
    editEvent,
    deleteEvent,
}