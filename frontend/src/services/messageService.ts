import { IMessage } from "../Interfaces/IMessage";

const baseUrl = process.env.REACT_APP_BASE_URL;
const msgUrl = `${baseUrl}/messages`;

export const fetchMessages = async (eventId:string) => {
    try {
        const response = await fetch(`msgUrl/${eventId}`);
        const data = await response.json();
        return {
            message: data.message,
            messages: data.messages,
        }
    } catch (error: any) {
        const message =
            (error.response && error.response.data && error.response.data.message)
            || error.message
            || error.toString();
        throw new Error(message);
    }
}

const sendMessage = async (msg: IMessage) => {
    const response = await fetch(msgUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(msg)
    });
    const data = await response.json();
    return {
        message: data.message,
    }
}

export default {
    fetchMessages,
    sendMessage
}