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
import Loader from '../../UI/Loader/Loader';
import ConfirmDialog from '../../Shared/ConfirmDialog/ConfirmDialog';
import eventService from '../../../services/eventService';

const EventsTab = () => {

    const socket = useContext(SocketContext);
    const dispatch = useMyDispatch();
    const { user } = useMySelector(state => state.auth);
    const userId = user?.id;

    const [loading, setLoading] = useState(false);
    const [showEventForm, setShowEventForm] = useState(false);
    const [events, setEvents] = useState<IEventCompact[]>([]);
    const [currentEvent, setCurrentEvent] = useState<IEventCompact | null>();
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalAction, setModalAction] = useState('');


    useEffect(() => {
        getCurrentEvents();
        console.log(currentEvent)
    }, []);

    useEffect(() => {
        const detailsViewOpen = !!currentEvent;
        const body = document.body;
        body.style.overflow = detailsViewOpen ? 'hidden' : 'auto';
    }, [currentEvent])

    useEffect(() => {
        if (!socket) return;
        socket.on('fetch event data', getCurrentEvents);

        return () => {
            socket.off('fetch event data');
        }
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

    const onArchiveEvent = (eventId: string) => (ev: any) => {
        ev.preventDefault();
        setModalAction('archive');
        setIsModalOpen(true);
    }

    const onRestoreEvent = (eventId: string) => (ev: any) => {
        ev.preventDefault();
        setModalAction('restore');
        setIsModalOpen(true);
    }

    const onDeleteEvent = (eventId: string) => (ev: any) => {
        ev.preventDefault();
        setModalAction('delete');
        setIsModalOpen(true);
    }

    const handleModalClose = (answer: boolean) => {
        setIsModalOpen(false);
        if (answer) {
            const eventToModifyId = currentEvent?.id;
            
            if (eventToModifyId) {
                if (modalAction === 'archive') {
                    eventService
                        .archiveEvent(eventToModifyId)
                        .then((data) => {
                            console.log(data);
                            if (data.success) {
                                dispatch(setMessage(data.message));
                                setEvents(oldEents => oldEents.map((event: IEventCompact) => event.id === eventToModifyId ? { ...event, archived: true } : event));
                                setCurrentEvent({ ...currentEvent, archived: true });
                                socket?.emit('new poll published', currentEvent.title);
                            }
                        })
                        .catch(err => {
                            dispatch(setMessage(err.message));
                        });
                } else if (modalAction === 'restore') {
                    eventService
                        .restoreEvent(eventToModifyId)
                        .then((data) => {
                            if (data.success) {
                                dispatch(setMessage(data.message));
                                setEvents(oldEvents => oldEvents.map((event: IEventCompact) => event.id === eventToModifyId ? { ...event, archived: false } : event));
                                setCurrentEvent({ ...currentEvent, archived: false });
                                socket?.emit('new poll published', currentEvent.title);
                            }
                        })
                        .catch(err => {
                            dispatch(setMessage(err.message));
                        });
                } else if (modalAction === 'delete') {
                    eventsService
                        .deleteEvent(eventToModifyId)
                        .then(() => {
                            dispatch(setMessage('Event deleted successfully'));
                            setEvents((oldEvents: IEventCompact[]) => oldEvents.filter((x: IEventCompact) => x.id !== eventToModifyId));
                            setCurrentEvent(null);
                            socket?.emit('new poll published', currentEvent.title);
                        })
                        .catch(err => {
                            dispatch(setMessage(err.message));
                        });
                }
            }
        } else {
            setModalAction('');
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

            <h2>YOUR EVENTS</h2>
            <p>Click on an event for details</p>
            <div className={styles.loadingWrapper}>

                {loading && <Loader />}

                {!loading && !events && <p>You have no events yet.</p>}

                {!loading &&
                    <div className={styles.eventsHolder}>
                        <div className={styles.eventsGroupLabel}>Active events</div>
                        {events && events.filter((event: any) => !event.archived).map((event: any) => {
                            return (<EventCard key={event.id} event={event} onSelectEvent={selectEvent} />)
                        })}
                    </div>}

                    {!loading &&
                    <div className={styles.eventsHolder}>
                        <div className={styles.eventsGroupLabel}>Archived events</div>
                    {events && events.filter((event: any) => event.archived).map((event: any) => {
                            return (<EventCard key={event.id} event={event} onSelectEvent={selectEvent} />)
                        })}
                    </div>}

            </div>

            {currentEvent &&
                <EventDetails
                    event={currentEvent}
                    onDetailsClose={handleDetailViewClose}
                    handleEditUser={handleEditUser}
                    handleArchiveEvent={onArchiveEvent}
                    handleRestoreEvent={onRestoreEvent}
                    handleDeleteEvent={onDeleteEvent}
                />}

            {isModalOpen && <ConfirmDialog itemType="event" actionType={modalAction} onDialogClose={handleModalClose} />}

        </div>
    )
}

export default EventsTab;