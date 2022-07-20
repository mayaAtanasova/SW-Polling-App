import { IMessage } from "./IMessage";
import { IUser } from "./IUser";

export interface IEvent {
    id?: string;
    title: string;
    voted?: [];
    attendees: IUser[];
    messages: IMessage[];
}