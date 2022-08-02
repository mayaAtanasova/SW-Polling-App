import { IMessage } from "./IMessage";
import { IPoll } from "./IPoll";
import { IUser, IUserCompact } from "./IUser";

export interface IEvent {
    id?: string;
    title: string;
    description: string;
    host: string;
    polls?: IPoll[];
    voted?: [];
    attendees: IUser[];
    messages: IMessage[];
}

export interface IEventCompact {
id: string;
title: string;
description: string;
attendees: IUserCompact[];
polls: IPoll[];
host: string;
date: string;
archived: boolean;
}
