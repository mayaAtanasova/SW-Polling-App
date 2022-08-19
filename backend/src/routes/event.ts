import { Router } from 'express';
import { body } from 'express-validator';
import event from '../controllers/event';

export const eventRouter = Router();

eventRouter.get('/:evid', event.fetchEventData);

eventRouter.get('/admins/:createdBy', event.getEventsByCreator);

eventRouter.get('/polls/:evid', event.fetchEventPolls);

eventRouter.get('/attendees/:evid', event.fetchEventAttendees);

eventRouter.post('/', 
body('title').isLength({ min: 1 }).withMessage('Title is required'),
body('userId').isLength({ min: 1 }).withMessage('UserId is required'),
event.createEvent);

eventRouter.post('/join', 
body('title').isLength({ min: 1 }).withMessage('Title is required'),
event.joinEvent);

eventRouter.post('/archive/:evid', event.archiveEvent);
eventRouter.post('/restore/:evid', event.restoreEvent);
eventRouter.post('/edit/:evid', event.editEvent);

eventRouter.post('/vpoints', event.updateVpoints);

eventRouter.delete('/:evid', event.deleteEvent);
