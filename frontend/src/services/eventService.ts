

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

const leaveEvent = async (leaveCredentials: { eventId:string, userId: string}) => {
    try {
        const response = await fetch(`${eventUrl}/leave`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(leaveCredentials)
        });
        const data = await response.json();
        localStorage.removeItem('eventId');
        return {
            message: data.message,
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
    leaveEvent,
}