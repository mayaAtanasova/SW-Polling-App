import styles from './EventDetails.module.css';
import moment from 'moment';
import { useEffect } from 'react';
import UsersTable from '../../../Shared/UsersTable/UsersTable';

type componentProps = {
    event: {
        id: string,
        title: string,
        description: string,
        host: string,
        polls: [],
        attendees: [{
            id: string,
            displayName: string,
            email: string,
            vpoints: number,
        }],
        date: string,
    },
    onDetailsClose: (eventId:string) => (ev:any) => void,
}

const EventDetails = ({ event, onDetailsClose }: componentProps) => {

    useEffect(() => {
        console.log('event', event);
        console.log('attended by', event.attendees);
    }, []);

    return (
        <div className={styles.eventDetailsBkg}>
            <div className={styles.eventDetailsWrapper}>
                <div className={styles.eventDetailsTitle}>
                    <h2>{event.title}</h2>
                </div>
                <div className={styles.eventDetailsDescription}>
                    <h4>{event.description}</h4>
                </div>
                <p>Created by: <span>{event.host}</span></p>
                <p>Created on: <span>{moment(event.date).format('DD.MM.YYYY')}</span></p>
                <p>Attendees:</p>
                <div className={styles.attendeeTableWrapper}>
                    <UsersTable users={event.attendees} />
                </div>
                <p>Polls:</p>
                <button onClick={onDetailsClose(event.id)}>Close</button>
            </div>
        </div>
    )
}

export default EventDetails;