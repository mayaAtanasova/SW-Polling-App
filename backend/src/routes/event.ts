import { Router } from 'express';
import event from '../controllers/event';

export const eventRouter = Router();

eventRouter.get('/:evid', event.fetchEventData);
eventRouter.post('/', event.createEvent);
eventRouter.delete('/:evid', event.deleteEvent);