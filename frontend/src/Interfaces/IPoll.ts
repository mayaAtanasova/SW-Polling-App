import { IVote } from "./IVote";

export interface IPoll {
    _id?: string;
    title: string;
    event: string;
    createdBy: string;
    createdAt: string;
    editedAt: string;
    options: string[];
    votes: IVote[];
    locked: boolean;
}
