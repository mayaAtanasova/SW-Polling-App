import { IUser } from '../../../../Interfaces/IUser';
import moment from 'moment';
import styles from './EventCard.module.css';

type componentProps = {
    event: {
        id: string,
        title: string,
        description: string,
        host: string,
        polls: string[],
        attendees: IUser[],
        archived: boolean,
        date: string,
    },
    onSelectEvent: (eventId: string) => (ev:any) => void,
}

const EventCard = ({ event, onSelectEvent }: componentProps) => {
    return (
        <div 
        className={`${styles.eventCard} ${event.archived ? styles.archivedEvent : ''}`}
        onClick={onSelectEvent(event.id)}>
            <div className={styles.titleHolder}>
                <h2>{event.title}</h2>
            </div>
            <div className={styles.description}>
                <h4>{event.description}</h4>
            </div>
            <p>Host: <span>{event.host}</span></p>
            <p>Attendees: <span>{event.attendees.length}</span></p>
            <p>Polls: <span>{event.polls.length}</span></p>
            <p>Created: <span>{moment(event.date).format('DD.MM.YYYY')}</span></p>
        </div>
    )
}

export default EventCard;