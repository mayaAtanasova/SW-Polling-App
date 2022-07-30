import LargeButton from '../../UI/LargeButton/LargeButton';

import styles from './EventsTab.module.css';

const EventsTab = () => {
    return (
        <div className={styles.eventsWrapper}>
            <LargeButton
                text="create new event"
                onClick={() => console.log('create event')}
            />
        </div>
    )
}

export default EventsTab;