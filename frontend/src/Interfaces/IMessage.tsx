export interface IMessage {
    id?: string;
    _id?: string;
    evid: string;
    text: string;
    username: string;
    userId: string;
    date: string;
    answered?: boolean;
}