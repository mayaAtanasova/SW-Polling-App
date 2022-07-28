import { Router } from 'express';
import { body } from 'express-validator';
import event from '../controllers/event';

export const eventRouter = Router();

eventRouter.get('/:evid', event.fetchEventData);

eventRouter.post('/', 
body('title').isLength({ min: 1 }).withMessage('Title is required'),
body('userId').isLength({ min: 1 }).withMessage('UserId is required'),
event.createEvent);

eventRouter.post('/join', 
body('title').isLength({ min: 1 }).withMessage('Title is required'),
event.joinEvent);

eventRouter.delete('/:evid', event.deleteEvent);