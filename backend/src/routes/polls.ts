import { Router } from 'express';
import { body } from 'express-validator';
import polls from '../controllers/poll';

export const pollsRouter = Router();

pollsRouter.post('/', 
body('type').isLength({ min: 1 }).withMessage('Type is required'),
body('title').isLength({ min: 1 }).withMessage('Title is required'),
body('userId').isLength({ min: 1 }).withMessage('UserId is required'),
body('eventId').isLength({ min: 1 }).withMessage('EventId is required'),
polls.createPoll);

pollsRouter.post('/:pollId', 
body('type').isLength({ min: 1 }).withMessage('Type is required'),
body('title').isLength({ min: 1 }).withMessage('Title is required'),
body('userId').isLength({ min: 1 }).withMessage('UserId is required'),
body('eventId').isLength({ min: 1 }).withMessage('EventId is required'),
polls.editPoll);

pollsRouter.delete('/:pollId', polls.deletePoll);

pollsRouter.post('lock', 
body('pollId').isLength({ min: 1 }).withMessage('PollId is required'),
polls.lockPoll);

pollsRouter.post('/', 
body('eventId').isLength({ min: 1 }).withMessage('EventId is required'),
polls.getPollsByEvent);

pollsRouter.post('/vote', 
body('pollId').isLength({ min: 1 }).withMessage('PollId is required'),
body('userId').isLength({ min: 1 }).withMessage('UserId is required'),
polls.voteInPoll);
