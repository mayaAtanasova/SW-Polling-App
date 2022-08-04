export interface IVote {
    _id?: string;
    poll?: string;
    option?: string;
    user: string | {
        _id: string;
        displayName: string;
    };
    createdAt?: string;
}