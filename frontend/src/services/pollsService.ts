import { IPoll, IPollCompact } from '../Interfaces/IPoll';

const baseUrl = process.env.REACT_APP_BASE_URL;
const pollsUrl = `${baseUrl}/polls`;

const getPollById = async (pollId: string) => {
    try {
        const response = await fetch(`${pollsUrl}/${pollId}`);
        const data = await response.json();
        return data.poll;
    } catch (error: any) {
        const message =
            (error.response && error.response.data && error.response.data.message)
            || error.message
            || error.toString();
        console.log(message);
    }
}

const getPollsByCreator = async (creatorId: string) => {
    try {
        const response = await fetch(`${pollsUrl}/creators/${creatorId}`);
        const data = await response.json();
        return data;
    } catch (error: any) {
        const message =
            (error.response && error.response.data && error.response.data.message)
            || error.message
            || error.toString();
        console.log(message);
    }
}

const getPollsByEvent = async (eventId: string) => {
    try {
        const response = await fetch(`${pollsUrl}/events/${eventId}`);
        const data = await response.json();
        console.log(data);
        return {
            polls: data.polls,
            message: 'Polls fetched successfully'
        }
    } catch (error: any) {
        const message =
            (error.response && error.response.data && error.response.data.message)
            || error.message
            || error.toString();
        console.log(message);
    }
}

const voteInPoll = async (pollId: string, userId: string, option: string) => {
    try {
        const response = await fetch(`${pollsUrl}/vote`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                pollId,
                userId,
                option,
            })
        })
        const data = await response.json();
        return data;
    } catch (error: any) {
        const message =
            (error.response && error.response.data && error.response.data.message)
            || error.message
            || error.toString();
        console.log(message);
    }
}

const createPoll = async (poll: { type: string, title: string, userId: string, eventId: string, options: string[] }) => {
    try {
        const response = await fetch(`${pollsUrl}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(poll)
        })
        const data = await response.json();
        return data;
    } catch (error: any) {
        const message =
            (error.response && error.response.data && error.response.data.message)
            || error.message
            || error.toString();
        console.log(message);
    }
}

export default {
    getPollById,
    getPollsByCreator,
    getPollsByEvent,
    voteInPoll,
    createPoll,
}