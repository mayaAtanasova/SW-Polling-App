import { useState } from 'react';
import LargeButton from '../../UI/LargeButton/LargeButton';
import EventForm from '../EventForm/EventForm';

import styles from './EventsTab.module.css';

const EventsTab = () => {
    const [showEventForm, setShowEventForm ] = useState(false);

    const revealEventForm = (event:any) => {
        event.preventDefault();
        setShowEventForm(true);
    }

    const hideEventForm = () => {
        setShowEventForm(false);
    }

    return (
        <div className={styles.eventsWrapper}>
            { !showEventForm && <LargeButton
                text="create new event"
                onClick={revealEventForm}
            />}
            {showEventForm && <EventForm hideEventForm={hideEventForm}/>}
        </div>
    )
}

export default EventsTab;