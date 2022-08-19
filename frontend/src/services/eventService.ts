

const baseUrl = process.env.REACT_APP_BASE_URL;
const eventUrl = `${baseUrl}/events`;

type EventCredentials = {
    title: string,
    description?: string
    userId: string,
}

type userVPoints = {
    userId: string,
    vpoints: number,
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
        if (response.status !== 200) {
            const errorData = await response.json();
            return {
                message: errorData.message,
                event: null,
            } 
        }
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

const fetchEventPolls = async (eventId: string) => {
    try {
        const response = await fetch(`${eventUrl}/polls/${eventId}`);
        const data = await response.json();
        return data;
    } catch (error: any) {
        const message =
            (error.response && error.response.data && error.response.data.message)
            || error.message
            || error.toString();
        console.error(message);
    }
}

const fetchEventAttendees = async (eventId: string) => {
    try {
        const response = await fetch(`${eventUrl}/attendees/${eventId}`);
        const data = await response.json();
        return data;
    } catch (error: any) {
        const message =
            (error.response && error.response.data && error.response.data.message)
            || error.message
            || error.toString();
        console.error(message);
    }
}

const createEvent = async ({ title, description, userId }: EventCredentials) => {
    try {
        const response = await fetch(`${eventUrl}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, description, userId })
        });
        const data = await response.json();
        return {
            message: data.message,
            event: data.event
        };
    } catch (error: any) {
        const message =
            (error.response && error.response.data && error.response.data.message)
            || error.message
            || error.toString();
        console.error(message);
    }
}

const getEventsByCreator = async (userId: string) => {
    try {
        const response = await fetch(`${eventUrl}/admins/${userId}`);
        const data = await response.json();
        return data;
    } catch (error: any) {
        const message =
            (error.response && error.response.data && error.response.data.message)
            || error.message
            || error.toString();
        console.error(message);
    }
}

const editEvent = async (pollsHidden: boolean, chatHidden: boolean, eventId:string) => {
    try {
        const response = await fetch(`${eventUrl}/edit/${eventId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ pollsHidden, chatHidden })
        });
        const data = await response.json();
        return data;
    } catch (error: any) {
        const message =
            (error.response && error.response.data && error.response.data.message)
            || error.message
            || error.toString();
        console.error(message);
    }
}

const archiveEvent = async (eventId: string) => {
    try {
        const response = await fetch(`${eventUrl}/archive/${eventId}`, {
            method: 'POST',
        });
        const data = await response.json();
        return data;
    } catch (error: any) {
        const message =
            (error.response && error.response.data && error.response.data.message)
            || error.message
            || error.toString();
        console.error(message);
    }
}

const restoreEvent = async (eventId: string) => {
try{
    const response = await fetch(`${eventUrl}/restore/${eventId}`, {
        method: 'POST',
    });
    const data = await response.json();
    return data;
} catch (error: any) {
    const message =
        (error.response && error.response.data && error.response.data.message)
        || error.message
        || error.toString();
    console.error(message);
}
}

const deleteEvent = async (eventId: string) => {
    try {
        const response = await fetch(`${eventUrl}/${eventId}`, {
            method: 'DELETE',
        });
        const data = await response.json();
        return data;
    } catch (error: any) {
        const message =
            (error.response && error.response.data && error.response.data.message)
            || error.message
            || error.toString();
        console.error(message);
    }
}

const editUserVpoints = async ( userVPoints:userVPoints ) => {
    try {
        const response = await fetch(`${eventUrl}/vpoints`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userVPoints)
        });
        const data = await response.json();
        return data;
    } catch (error: any) {
        const message =
            (error.response && error.response.data && error.response.data.message)
            || error.message
            || error.toString();
        console.error(message);
    }
}

export default {
    joinEvent,
    fetchEventData,
    fetchEventPolls,
    fetchEventAttendees,
    createEvent,
    editEvent,
    archiveEvent,
    restoreEvent,
    deleteEvent,
    getEventsByCreator,
    editUserVpoints
}