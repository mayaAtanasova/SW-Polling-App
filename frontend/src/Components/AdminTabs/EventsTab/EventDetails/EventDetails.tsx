import styles from './EventDetails.module.css';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import UsersTable from '../../../Shared/UsersTable/UsersTable';
import { IUserCompact } from '../../../../Interfaces/IUser';
import { IEventCompact } from '../../../../Interfaces/IEvent';
import { useEffect, useState } from 'react';
import EventPollsTable from '../EventPollsTable/EventPollsTable';

type componentProps = {
    event: IEventCompact;
    onDetailsClose: (eventId: string) => (ev: any) => void,
    handleEditUser: (eventId: string) => (user: IUserCompact) => void,
}

const EventDetails = ({ event, onDetailsClose, handleEditUser }: componentProps) => {

    const [sliceIndex, setSliceIndex] = useState<number>(0);
    const attendeeSlice = event.attendees.slice(sliceIndex, sliceIndex + 3);
    const lessAvailable = sliceIndex > 0;
    const moreAvailable = sliceIndex < event.attendees.length - 3;

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
                <h3>Attendees: </h3>
                {event.attendees.length === 0 && <h4>No one is attending yet.</h4>}
                <div className={styles.attendeeTableWrapper}>
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
                </div>
                <div className={styles.divider}></div>
                <h3>Polls:</h3>
                {event.polls.length === 0 && <h4>No polls for this event yet.</h4>}
                <div className={styles.pollTableWrapper}>
                    {event.polls.length > 0 && <EventPollsTable
                        polls={event.polls}
                    />}
                </div>
                <button className={styles.closeBtn} onClick={onDetailsClose(event.id)}>
                    <FontAwesomeIcon icon={faClose} />
                </button>
            </div>
        </div>
    )
}

export default EventDetails;