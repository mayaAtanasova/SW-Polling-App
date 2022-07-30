export default interface Poll {
    _id: string,
    title: string,
    type: string,
    event: string,
    createdBy: string,
    createdAt: string,
    editedAt: string,
    options: string[],
    votes: string[],
}