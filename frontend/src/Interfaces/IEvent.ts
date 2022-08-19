import { IMessage } from "./IMessage";
import { IPoll } from "./IPoll";
import { IUser, IUserCompact } from "./IUser";

export interface IEvent {
    id?: string;
    title: string;
    description: string;
    attendees: IUser[];
    polls: IPoll[];
    messages: IMessage[];
    host: string;
    chatHidden: boolean;
    pollsHidden: boolean;
}

export interface IEventCompact {
    id: string;
    title: string;
    description: string;
    attendees: IUserCompact[];
    polls: IPoll[];
    messages: IMessage[];
    host: string;
    date: string;
    archived: boolean;
    chatHidden: boolean;
    pollsHidden: boolean;
}
