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
}
