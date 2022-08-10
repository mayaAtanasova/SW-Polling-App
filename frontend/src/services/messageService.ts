import { IMessage } from "../Interfaces/IMessage";

const baseUrl = process.env.REACT_APP_BASE_URL;
const msgUrl = `${baseUrl}/messages`;

const fetchMessages = async (eventId:string) => {
    try {
        const response = await fetch(`${msgUrl}/${eventId}`);
        const data = await response.json();
        return {
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
    try {
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
    } catch (error: any) {
        const message =
            (error.response && error.response.data && error.response.data.message)
            || error.message
            || error.toString();
        console.log(message);
    }
}

const deleteMessage = async (messageId: string, eventId: string) => {
    try {
        const response = await fetch(`${msgUrl}/${messageId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ eventId })
        });
        const data = await response.json();
        return {
            message: data.message,
            success: data.success,
        }
    } catch (error: any) {
        const message =
            (error.response && error.response.data && error.response.data.message)
            || error.message
            || error.toString();
        console.log(message);
    }
}

const answerMessage = async (messageId: number) => {}

export default {
    fetchMessages,
    sendMessage,
    deleteMessage,
    answerMessage,
}