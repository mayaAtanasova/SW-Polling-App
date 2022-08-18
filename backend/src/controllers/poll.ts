import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { Event, User, Poll } from '../models';
import PollInterface from '../interfaces/pollInterface';
import { Vote } from '../models';
import mongoose from 'mongoose';
import UserInterface from 'src/interfaces/userInterface';

const createPoll = async (req: Request, res: Response, next: NextFunction) => {
    const { type, title, userId, eventId, options } = req.body;
    console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        return res.status(401).send({ message: 'Invalid fields sent' });
    }
    //find event
    let event;
    try {
        event = await Event.findById(eventId).populate('createdBy polls');
    } catch (err) {
        return next(new Error('Could not find event by id: ' + err));
    }

    // check if creator of poll is the creator of the event
    if (event.createdBy._id.toString() !== userId) {
        return next(new Error('You are not the creator of this event and cannot add polls'));
    }
    const newPoll = new Poll({
        type,
        title,
        event: eventId,
        createdBy: userId,
        options,
    });
    //Transaction to both collections event and poll
    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await newPoll.save({ session: sess });
        event.polls.push(newPoll);
        await event.save({ session: sess });
        await sess.commitTransaction();
    } catch (err) {
        return next(new Error('Could not create poll: ' + err));
    }
    //Send response
    res.status(200).json({
        message: 'Poll created successfully',
        poll: newPoll,
    })
}

const editPoll = async (req: Request, res: Response, next: NextFunction) => {
    const pollId = req.params.pollId;
    const { type, title, eventId, options } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        return next(new Error('Invalid fields sent' + errors));
    }

    try {
        const updatedPoll = await Poll.findByIdAndUpdate(pollId, {
            type,
            title,
            event: eventId,
            options,
            editedAt: Date.now(),
        }, { new: true });
        res.status(200).json({ message: 'Poll updated successfully', poll: updatedPoll });
    } catch (err: any) {
        return next(new Error('Could not edit poll: ' + err));
    };
}

const deletePoll = async (req: Request, res: Response, next: NextFunction) => {
    const pollId = req.params.pollId;

    try {
        const deletedPoll = await Poll.findByIdAndUpdate(pollId, {deleted: true }, { new: true });
        res.status(200).json({ message: 'Poll updated successfully', success: true, poll: deletedPoll });
    } catch (err: any) {
        return next(new Error('Could not edit poll: ' + err));
    };
}

const concludePoll = async (req: Request, res: Response, next: NextFunction) => {
    const { pollId } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        return res.status(401).send({ message: 'Invalid fields sent' });
    }
    try {
        const updatedPoll = await Poll.findByIdAndUpdate(pollId, {concluded: true }, { new: true });
        res.status(200).json({ message: 'Poll updated successfully', success: true, poll: updatedPoll });
    } catch (err: any) {
        return next(new Error('Could not edit poll: ' + err));
    };
}

const reactivatePoll = async (req: Request, res: Response, next: NextFunction) => {
    console.log('reactivating poll');
    const { pollId } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        return res.status(401).send({ message: 'Invalid fields sent' });
    }
    try {
        const updatedPoll = await Poll.findByIdAndUpdate(pollId, {concluded: false }, { new: true });
        res.status(200).json({ message: 'Poll updated successfully', success: true, poll: updatedPoll });
    } catch (err: any) {
        return next(new Error('Could not edit poll: ' + err));
    };
}

const getPollById = async (req: Request, res: Response, next: NextFunction) => {
    const pollId = req.params.pollId;
    try {
        Poll
            .findById(pollId)
            .populate([
                {
                    path: 'createdBy',
                    select: '_id displayName',
                },
                {
                    path: 'event',
                    select: '_id title',
                },
                {
                    path: 'votes',
                    select: 'option user createdAt',
                    populate: {
                        path: 'user',
                        select: '_id displayName vpoints',
                    }
                }
            ])
            .exec((err: any, poll: any) => {
                if (err) {
                    return next(new Error('Could not find poll: ' + err));
                }
                if (!poll) {
                    return next(new Error('Poll not found'));
                }
                return res.status(200).json({ poll });
            })
    } catch (err) {
        return next(new Error('Could not fetch poll: ' + err));
    }
}

const getPollsByCreator = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.userId;
    console.log(userId);
    try {
        Poll
            .find({ createdBy: userId })
            .populate([
                {
                    path: 'createdBy',
                    select: '_id displayName',
                },
                {
                    path: 'event',
                    select: '_id title',
                },
                {
                    path: 'votes',
                    select: 'option user createdAt',
                    populate: {
                        path: 'user',
                        select: '_id displayName vpoints',
                    }
                }
            ])
            .exec((err: any, polls: any) => {
                if (err) {
                    return next(new Error('Could not find poll: ' + err));
                }
                if (!polls) {
                    return next(new Error('Poll not found'));
                }

                const filteredPolls = polls.filter((poll: any) => {
                    return poll.deleted === false;
                })
                return res.status(200).json({ polls: filteredPolls });
            })
    } catch (err) {
        return next(new Error('Could not fetch poll: ' + err));
    }
}
const getPollsInEvent = async (req: Request, res: Response, next: NextFunction) => {
    const event = req.params.eventId;

    try {
        Poll
            .find({ event })
            .populate([
                {
                    path: 'event',
                    select: '_id title',
                },
                {
                    path: 'votes',
                    select: 'option user createdAt',
                    populate: {
                        path: 'user',
                        select: '_id displayName vpoints',
                    }
                }
            ])
            .exec((err: any, polls: any) => {
                if (err) {
                    return next(new Error('Could not find event: ' + err));
                }
                if (!event) {
                    return next(new Error('Event not found'));
                }
                return res.status(200).json({ polls })
            })
    } catch (err) {
        return next(new Error('Could not fetch polls: ' + err));
    }
}

const voteInPoll = async (req: Request, res: Response, next: NextFunction) => {
    const { pollId, userId, option } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        return res.status(401).send({ message: 'Invalid fields sent' });
    }
    let poll;
    try {
        poll = await Poll.findById(pollId).populate('votes');
    } catch (err) {
        return next(new Error('Could not find poll by id: ' + err));
    }

    //check if user already voted
    const index = poll.votes.findIndex((vote: any) => vote.user.toString() === userId);
    if (index !== -1) {
        return res.status(401).json({ message: `User already voted` });
    }

    //create vote
    const newVote = new Vote({
        poll: pollId,
        option,
        user: userId,
    })

    //Transaction
    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await newVote.save({ session: sess });
        poll.votes.push(newVote);
        await poll.save({ session: sess });
        await sess.commitTransaction();

    } catch (err) {
        return next(new Error('DB transaction failed: ' + err));
    }

    //send response
    res.status(200).json({
        message: 'User voted successfully',
        vote: newVote,
    })
}

export default {
    createPoll,
    editPoll,
    deletePoll,
    concludePoll,
    reactivatePoll,
    getPollById,
    voteInPoll,
    getPollsByCreator,
    getPollsInEvent
}