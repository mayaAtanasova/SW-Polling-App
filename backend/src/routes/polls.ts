import { Router } from 'express';
import { body } from 'express-validator';
import polls from '../controllers/poll';

export const pollsRouter = Router();

pollsRouter.get('/:pollId', polls.getPollById);
pollsRouter.get('/creators/:userId', polls.getPollsByCreator);
pollsRouter.get('/events/:eventId', polls.getPollsInEvent);

pollsRouter.post('/vote', 
body('pollId').isLength({ min: 1 }).withMessage('PollId is required'),
body('userId').isLength({ min: 1 }).withMessage('UserId is required'),
polls.voteInPoll);

pollsRouter.post('/lock', 
body('pollId').isLength({ min: 1 }).withMessage('PollId is required'),
polls.lockPoll);

pollsRouter.post('/:pollId', 
body('type').isLength({ min: 1 }).withMessage('Type is required'),
body('title').isLength({ min: 1 }).withMessage('Title is required'),
body('userId').isLength({ min: 1 }).withMessage('UserId is required'),
body('eventId').isLength({ min: 1 }).withMessage('EventId is required'),
polls.editPoll);

pollsRouter.post('/', 
body('type').isLength({ min: 1 }).withMessage('Type is required'),
body('title').isLength({ min: 1 }).withMessage('Title is required'),
body('userId').isLength({ min: 1 }).withMessage('UserId is required'),
body('eventId').isLength({ min: 1 }).withMessage('EventId is required'),
polls.createPoll);

pollsRouter.delete('/:pollId', polls.deletePoll);
