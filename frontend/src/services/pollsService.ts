import { IPoll } from '../Interfaces/IPoll';

const baseUrl = process.env.REACT_APP_BASE_URL;
const pollsUrl = `${baseUrl}/polls`;

const getPollbyId = async (pollId: string) => {
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

export default {
    getPollbyId,
    voteInPoll,
}