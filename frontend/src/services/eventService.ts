

const baseUrl = process.env.REACT_APP_BASE_URL;
const eventUrl = `${baseUrl}/events`;

type EventCredentials = {
    title: string,
    userId: string,
}

const joinEvent = async (eventCredentials: EventCredentials) => {
    try {
        const response = await fetch(`${eventUrl}/join`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(eventCredentials)
        });
        const data = await response.json();
        localStorage.setItem('eventId', data.evid);
        localStorage.setItem('eventTitle', data.eventTitle);
        return {
            message: data.message,
            evid: data.evid
        };
    } catch (error: any) {
        const message =
            (error.response && error.response.data && error.response.data.message)
            || error.message
            || error.toString();
        throw new Error(message);
    }
}

const fetchEventData = async (eventId: string) => {
    try {
        const response = await fetch(`${eventUrl}/${eventId}`);
        const data = await response.json();
        return {
            message: data.message,
            event: data.event,
        };
    } catch (error: any) {
        const message =
            (error.response && error.response.data && error.response.data.message)
            || error.message
            || error.toString();
        throw new Error(message);
    }
}

export default {
    joinEvent,
    fetchEventData,
}