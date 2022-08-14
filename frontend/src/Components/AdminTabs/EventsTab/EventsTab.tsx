import { useEffect, useState, useContext } from 'react';

import LargeButton from '../../UI/LargeButton/LargeButton';
import EventForm from './EventForm/EventForm';
import EventCard from './EventCard/EventCard';
import EventDetails from './EventDetails/EventDetails';

import { IUserCompact } from '../../../Interfaces/IUser';
import { IEventCompact } from '../../../Interfaces/IEvent';

import { useMyDispatch, useMySelector } from '../../../hooks/useReduxHooks';
import eventsService from '../../../services/eventService';
import { setMessage } from '../../../store/messageSlice';
import { SocketContext } from '../../../store/socketContext';

import styles from './EventsTab.module.css';

const EventsTab = () => {

    const socket = useContext(SocketContext);
    const [showEventForm, setShowEventForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [events, setEvents] = useState<IEventCompact[]>([]);
    const [currentEvent, setCurrentEvent] = useState<IEventCompact | null>();
    const { user } = useMySelector(state => state.auth);
    const userId = user?.id;

    const dispatch = useMyDispatch();

    useEffect(() => {
        getCurrentEvents();
        console.log(currentEvent)
    }, []);

    useEffect(() => {
        if (!socket) return;
        socket.on('fetch event data', getCurrentEvents);
    }, [socket]);

    const getCurrentEvents = () => {
        console.log('getting events in events tab')
        if (userId) {
            setLoading(true);
            eventsService
                .getEventsByCreator(userId)
                .then((data) => {
                    if (data) {
                        console.log(data.events);
                        setEvents(data.events);
                        setLoading(false);
                    }
                })
                .catch(err => {
                    dispatch(setMessage(err.message));
                    setLoading(false);
                });
        }
    };

    const revealEventForm = (event: any) => {
        event.preventDefault();
        setShowEventForm(true);
    }

    const hideEventForm = () => {
        setShowEventForm(false);
        getCurrentEvents();
    }

    const selectEvent = (eventId: string) => (ev: any) => {
        ev.preventDefault();
        const selectedEvent = events.find((event: any) => event.id === eventId);
        if (selectedEvent) {
            setCurrentEvent(selectedEvent);
        }
    }

    const handleDetailViewClose = (eventId: string) => (ev: any) => {
        setCurrentEvent(null);
    }

    const handleEditUser = (eventId: string) => (user: IUserCompact) => {
        const eventToModify = events.find((event: IEventCompact) => event.id === eventId);
        if (eventToModify) {
            const index = eventToModify.attendees.findIndex((attendee: IUserCompact) => attendee.id === user.id);
            if (index !== -1) {
                eventToModify.attendees[index] = user;
            }
            setEvents((oldEvents: IEventCompact[]) => oldEvents.map((x: IEventCompact) => x.id === eventId ? eventToModify : x));
        }
    }

    return (
        <div className={styles.eventsTabWrapper}>

            <div className={styles.divider}></div>

            <div className={styles.newButtonHolder}>
                {!showEventForm && <LargeButton
                    text="create new event"
                    onClick={revealEventForm}
                />}
            </div>

            {showEventForm && <EventForm hideEventForm={hideEventForm} />}

            <div className={styles.divider}></div>

            <h2>You have created the following events</h2>
            <p>Click on active events for details</p>
            {!events && <p>You have no events yet.</p>}
            <div className={styles.eventsHolder}>
                {events && events.map((event: any) => {
                    return (<EventCard key={event.id} event={event} onSelectEvent={selectEvent} />)
                })}
            </div>

            {currentEvent &&
                <EventDetails
                    event={currentEvent}
                    socket={socket}
                    onDetailsClose={handleDetailViewClose}
                    handleEditUser={handleEditUser}
                />}

        </div>
    )
}

export default EventsTab;