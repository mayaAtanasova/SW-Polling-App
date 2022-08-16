import { useEffect, useState } from 'react';
import moment from 'moment';
import { Socket } from 'socket.io-client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp, faArrowUpAZ, faClose } from '@fortawesome/free-solid-svg-icons';

import { IUserCompact } from '../../../../Interfaces/IUser';
import { IEventCompact } from '../../../../Interfaces/IEvent';

import UsersTable from '../../../Shared/UsersTable/UsersTable';
import EventPollsTable from '../EventPollsTable/EventPollsTable';
import EventMessagesTable from '../EventMessagesTable/EventMessagesTable';
import messageService from '../../../../services/messageService';
import eventService from '../../../../services/eventService';

import { useMySelector, useMyDispatch } from '../../../../hooks/useReduxHooks';
import { setMessage } from '../../../../store/messageSlice';

import styles from './EventDetails.module.css';

type componentProps = {
    event: IEventCompact;
    socket: Socket | null;
    onDetailsClose: (eventId: string) => (ev: any) => void,
    handleEditUser: (eventId: string) => (user: IUserCompact) => void,
}

const EventDetails = ({ event, socket, onDetailsClose, handleEditUser }: componentProps) => {

    const [loading, setLoading] = useState(false);
    const [eventData, setEventData ] = useState<IEventCompact>(event);
    const [sliceIndex, setSliceIndex] = useState<number>(0);
    const attendeeSlice = event.attendees.slice(sliceIndex, sliceIndex + 3);
    const lessAvailable = sliceIndex > 0;
    const moreAvailable = sliceIndex < event.attendees.length - 3;

    const [showAttendees, setShowAttendees] = useState(false);
    const [showPolls, setShowPolls] = useState(false);
    const [showMessages, setShowMessages] = useState(false);
    const { user } = useMySelector(state => state.auth);
    const userId = user?.id;

    const dispatch = useMyDispatch();

    useEffect(() => {
        if (!socket) return;
        socket.on('fetch messages', (title:string) => getCurrentMessages(title));                           
        socket.on('fetch event data', (title:string) => getCurrentAttendees(title));
        socket.on('fetch polls', (title:string) => getCurrentPolls(title));

        return () => {
            socket.off('fetch messages');
            socket.off('fetch event data');
            socket.off('fetch polls');
        }
    }, [socket]);

    
    const getCurrentMessages = (title:string) => {
        console.log('getting messages for current event in events tab')
        setLoading(true);
        console.log(title, event?.title);
        if (title === eventData.title) {
            const eventId = eventData.id;
            messageService
                .fetchMessages(eventId)
                .then((data) => {
                    if (data) {
                        console.log(data.messages);
                        setEventData(eventData => Object.assign(eventData, { messages: data.messages }));
                        console.log(eventData);
                        setLoading(false);
                    }
                })
                .catch(err => {
                    console.log(err);
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }

    const getCurrentAttendees = (title:string) => {
        console.log('getting attendees for current event in events tab')
        setLoading(true);
        console.log(title, event?.title);
        if (title === eventData.title) {
            const eventId = eventData.id;
            eventService
            .fetchEventAttendees(eventId)
            .then((data) => {
                if (data) {
                    console.log(data.attendees);
                    setEventData(eventData => Object.assign(eventData, { attendees: data.attendees }));
                    console.log(eventData);
                    setLoading(false);
                }
            })
            .catch(err => {
                console.log(err);
                setLoading(false);
            });
        } else {
            setLoading(false);
        }
    }

        const getCurrentPolls = (title:string) => {
            console.log('getting polls for current event in events tab')
            setLoading(true);
            console.log(title, event?.title);
            if (title === eventData.title) {
                const eventId = eventData.id;
                eventService
                .fetchEventPolls(eventId)
                .then((data) => {
                    if (data) {
                        console.log(data.polls);
                        setEventData(eventData => Object.assign(eventData, { polls: data.polls }));
                        console.log(eventData);
                        setLoading(false);
                    }
                })
                .catch(err => {
                    console.log(err);
                    setLoading(false);
                });
            } else {
                setLoading(false);
            }
        }

    const handleRestoreMessage =  (messageId: string) => async (ev:any) => {
        ev.preventDefault();
        console.log('restore clicked with message id ', messageId + ' in event ' + eventData.title);
        const restoredMessage = await messageService.restoreMessage(messageId);
        if(restoredMessage && restoredMessage.success) {
            console.log('message restored');
            getCurrentMessages(eventData.title);
            socket?.emit('chat message', userId, eventData.title);
        } else {
            dispatch(setMessage(restoredMessage?.message));
        }
    }

    const prevAttendees = () => {
        setSliceIndex(sliceIndex => sliceIndex - 3);
    }

    const nextAttendees = () => {
        setSliceIndex(sliceIndex + 3);
    }

    return (
        <div className={styles.eventDetailsBkg} >
            <div className={styles.eventDetailsWrapper}>
                <div className={styles.eventDetailsTitle}>
                    <h2>{event.title}</h2>
                </div>
                <div className={styles.eventDetailsDescription}>
                    <h4>{event.description}</h4>
                </div>
                <p>Created by: <span>{event.host}</span></p>
                <p>Created on: <span>{moment(event.date).format('DD.MM.YYYY')}</span></p>

                <div className={styles.divider}></div>
                <div className={styles.headingGroup}>
                    <h3>Attendees</h3>
                    <button onClick={() => setShowAttendees(showAttendees => !showAttendees)}>
                        {!showAttendees ? <FontAwesomeIcon icon={faAngleDown} /> : <FontAwesomeIcon icon={faAngleUp} />}
                    </button>
                </div>
                {event.attendees.length === 0 && <h4>No one is attending yet.</h4>}
                {showAttendees && <div className={styles.attendeeTableWrapper}>
                    {event.attendees.length > 0 && <UsersTable
                        users={attendeeSlice}
                        onEditUser={handleEditUser(event.id)}
                    />}
                    {event.attendees.length > 0 &&
                        <div className={styles.attendeesNavigationWrapper}>
                            <button disabled={!lessAvailable} onClick={prevAttendees}>&lt; prev</button>
                            <p>{sliceIndex + 1} to {sliceIndex + 3 > event.attendees.length ? event.attendees.length : sliceIndex + 3} of {event.attendees.length}</p>
                            <button disabled={!moreAvailable} onClick={nextAttendees}>next &gt;</button>
                        </div>
                    }
                </div>}

                <div className={styles.divider}></div>

                <div className={styles.headingGroup}>
                    <h3>Polls</h3>
                    <button onClick={() => setShowPolls(showPolls => !showPolls)}>
                        {!showPolls ? <FontAwesomeIcon icon={faAngleDown} /> : <FontAwesomeIcon icon={faAngleUp} />}
                    </button>
                </div>
                {event.polls.length === 0 && <h4>No polls for this event yet.</h4>}
                {showPolls && <div className={styles.pollTableWrapper}>
                    {event.polls.length > 0 && <EventPollsTable
                        polls={event.polls}
                    />}
                </div>}
                <button className={styles.closeBtn} onClick={onDetailsClose(event.id)}>
                    <FontAwesomeIcon icon={faClose} />
                </button>

                <div className={styles.divider}></div>

                <div className={styles.headingGroup}>
                    <h3>Messages</h3>
                    <button onClick={() => setShowMessages(showMessages => !showMessages)}>
                        {!showMessages ? <FontAwesomeIcon icon={faAngleDown} /> : <FontAwesomeIcon icon={faAngleUp} />}
                    </button>
                </div>
                {event.messages.length === 0 && <h4>No messages for this event yet.</h4>}
                {showMessages && <div className={styles.messagesWrapper}>
                    {event.messages.length > 0 && (
                        <>
                            <EventMessagesTable 
                            messages={event.messages.filter(messages => !messages.answered)} 
                            answered={false} 
                            />
                            <EventMessagesTable 
                            messages={event.messages.filter(messages => messages.answered)} 
                            answered={true} 
                            onRestoreMessage={handleRestoreMessage}
                            />
                        </>
                    )}
                </div>}
            </div>
        </div>
    )
}

export default EventDetails;
