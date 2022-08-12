import { IVote } from "./IVote";

export interface IPoll {
    _id?: string;
    type: string;
    title: string;
    event: string;
    createdBy: {
        _id: string;
        displayName: string;
    };
    createdAt: string;
    editedAt: string;
    options: string[];
    votes: IVote[];
    locked: boolean;
    concluded: boolean;
}

export interface IPollCompact {
        _id: string,
        title: string,
        type: string,
        event: { _id:string, title: string },
        createdBy: { displayName: string },
        createdAt: string,
        editedAt: string,
        options: string[],
        votes: IVote[],
        locked: boolean,
        concluded: boolean,
}