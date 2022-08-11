import { Router } from "express";
import messages from  '../controllers/message';

export const msgRouter = Router();

msgRouter.get('/:eventId', messages.fetchMessages);
msgRouter.post('/answer', messages.answerMessage);
msgRouter.post('/restore', messages.restoreMessage);

msgRouter.post('/', messages.sendMessage);

msgRouter.delete('/:messageId', messages.deleteMessage);

