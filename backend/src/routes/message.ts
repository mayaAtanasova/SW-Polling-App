import { Router } from "express";
import messages from  '../controllers/message';

export const msgRouter = Router();

msgRouter.get('/:eventTitle', messages.fetchMessages);

msgRouter.post('/', messages.sendMessage);

