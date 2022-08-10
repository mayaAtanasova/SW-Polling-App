export interface IVote {
    _id?: string;
    poll?: string;
    option?: string;
    user: {
        _id: string;
        displayName: string;
    };
    createdAt?: string;
}