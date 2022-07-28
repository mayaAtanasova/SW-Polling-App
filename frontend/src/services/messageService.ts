import { IMessage } from "../Interfaces/IMessage";

const baseUrl = process.env.REACT_APP_BASE_URL;
const msgUrl = `${baseUrl}/messages`;

export const fetchMessages = async (title:string) => {
    try {
        const response = await fetch(`${msgUrl}/${title}`);
        console.log(response);
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

export default {
    fetchMessages,
    sendMessage
}