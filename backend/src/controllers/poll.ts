import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { Event, User, Poll } from '../models';
import PollInterface from '../interfaces/pollInterface';
import { Vote } from '../models';
import mongoose from 'mongoose';

const createPoll = async (req: Request, res: Response, next: NextFunction) => {
    const { type, title, userId, eventId, options } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        return res.status(401).send({ message: 'Invalid fields sent' });
    }
    const newPoll = new Poll({
        type,
        title,
        event: eventId,
        createdBy: userId,
        options,
    });

    try {
        await newPoll.save();
    } catch (err) {
        return next(new Error('Could not create poll: ' + err));
    }

    res.status(200).json({
        message: 'Poll created successfully',
        poll: newPoll,
    })
}

const editPoll = async (req: Request, res: Response, next: NextFunction) => {
    const pollId = req.params.pollId;
    const { type, title, options } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        return res.status(401).send({ message: 'Invalid fields sent' });
    }
    Poll.findById(pollId, async (err: any, poll: any) => {
        if (err) {
            return next(new Error('Could not find poll: ' + err));
        }
        if (!poll) {
            return next(new Error('Poll not found'));
        }
        poll.type = type;
        poll.title = title;
        poll.options = options;
        poll.editedAt = new Date().toISOString();
        await poll.save();
        return res.status(200).json({ message: 'Poll edited successfully', poll });
    })
        .catch((err: any) => {
            return next(new Error('Could not edit poll: ' + err));
        });
}

const deletePoll = async (req: Request, res: Response, next: NextFunction) => {
    const pollId = req.params.pollId;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        return res.status(401).send({ message: 'Invalid fields sent' });
    }
    Poll.findById(pollId, (err: any, poll: any) => {
        if (err) {
            return next(new Error('Could not find poll: ' + err));
        }   
        if (!poll) {
            return next(new Error('Poll not found'));
        }
        poll.remove();
        return res.status(200).json({ message: 'Poll deleted successfully' });
    })
        .catch((err: any) => {
            return next(new Error('Could not delete poll: ' + err));
        });
}

const lockPoll = async (req: Request, res: Response, next: NextFunction) => {
    const { pollId } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        return res.status(401).send({ message: 'Invalid fields sent' });
    }
    Poll.findById(pollId, async (err: any, poll: any) => {
        if (err) {
            return next(new Error('Could not find poll: ' + err));
        }
        if (!poll) {
            return next(new Error('Poll not found'));
        }
        poll.locked = true;
        await poll.save();
        return res.status(200).json({ message: 'Poll locked successfully' });
    })
        .catch((err: any) => {
            return next(new Error('Could not lock poll: ' + err));
        });
}

const getPollsByEvent = async (req: Request, res: Response, next: NextFunction) => {
    const { eventId } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        return res.status(401).send({ message: 'Invalid fields sent' });
    }
    try {
        Event
            .findById(eventId)
            .populate('polls votes')
            .exec((err: any, event: any) => {
                if (err) {
                    return next(new Error('Could not find event: ' + err));
                }
                if (!event) {
                    return next(new Error('Event not found'));
                }
                const polls = event.polls.map((poll: PollInterface) => {
                    return {
                        id: poll._id,
                        type: poll.type,
                        title: poll.title,
                        options: poll.options,
                        createdBy: poll.createdBy,
                        createdAt: poll.createdAt,
                        editedAt: poll.editedAt,
                        votes: poll.votes,
                    }
                });
                return res.status(200).json({ polls, })
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
    const index = poll.votes.findIndex((vote: any) => vote._id.toString() === userId);
    if (index !== -1) {
        return res.status(401).json({ message: `User ${poll.votes[index].displayName} already voted`});
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
})
}

export default {
    createPoll,
    editPoll,
    deletePoll,
    lockPoll,
    getPollsByEvent,
    voteInPoll,
}