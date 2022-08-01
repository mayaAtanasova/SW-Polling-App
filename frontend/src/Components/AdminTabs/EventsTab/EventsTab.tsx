import { useEffect, useState } from 'react';

import LargeButton from '../../UI/LargeButton/LargeButton';
import EventForm from './EventForm/EventForm';
import { useMyDispatch, useMySelector } from '../../../hooks/useReduxHooks';
import eventsService from '../../../services/eventService';
import styles from './EventsTab.module.css';
import { setMessage } from '../../../store/messageSlice';
import EventCard from './EventCard/EventCard';
import EventDetails from './EventDetails/EventDetails';

const EventsTab = () => {
    const [showEventForm, setShowEventForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [events, setEvents] = useState([]);
    const [currentEvent, setCurrentEvent] = useState(null);

    const { user } = useMySelector(state => state.auth);
    const userId = user?.id;

    const dispatch = useMyDispatch();

    useEffect(() => {
        getCurrentEvents();
    }, []);

    const getCurrentEvents = () => {
        if (userId) {
            setLoading(true);
            eventsService
                .getEventsByCreator(userId)
                .then((data) => {
                    if (data) {
                        setEvents(data.events);
                        console.log(data);
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

    const selectEvent = (eventId: string) => (ev:any) => {
        ev.preventDefault();
        const selectedEvent = events.find((event: any) => event.id === eventId);
        if(selectedEvent){
            setCurrentEvent(selectedEvent);
        }
    }

    const handleDetailViewClose = (eventId:string) => (ev:any) => {
        setCurrentEvent(null);
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

            <h2>Your events</h2>
            <p>Click on active events for details</p>
            {!events && <p>You have no events yet.</p>}
            <div className={styles.eventsHolder}>
                {events && events.map((event: any) => {
                    return (<EventCard key={event.id} event={event} onSelectEvent={selectEvent}/>)
                })}
            </div>

            {currentEvent && <EventDetails event={currentEvent} onDetailsClose={handleDetailViewClose}></EventDetails>}

        </div>
    )
}

export default EventsTab;