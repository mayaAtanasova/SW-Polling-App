export default interface Message {
    _id: string,
    text: string,
    username: string,
    userId: string,
    date: string,
    answered: boolean,
}