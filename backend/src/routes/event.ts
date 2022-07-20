import { Router } from 'express';
import { body } from 'express-validator';
import event from '../controllers/event';

export const eventRouter = Router();

eventRouter.get('/:evid', event.fetchEventData);

eventRouter.post('/', 
body('title').isLength({ min: 1 }).withMessage('Title is required'),
event.createEvent);

eventRouter.post('/join', 
body('title').isLength({ min: 1 }).withMessage('Title is required'),
event.joinEvent);

eventRouter.post('/leave', event.leaveEvent)

eventRouter.delete('/:evid', event.deleteEvent);