
import moment from 'moment';
import { IPoll, IPollCompact } from '../../../../Interfaces/IPoll';

import styles from './PollCard.module.css'

type componentProps = {
    poll: IPollCompact,
    onSelectPoll: (pollId: string) => (ev: any) => void,
}

const PollCard = ({ poll, onSelectPoll }: componentProps) => {
    return (
        <div 
        className={`${styles.pollCard} ${poll.concluded ? styles.concludedPoll : ''}`}
        onClick={onSelectPoll(poll._id)}>
            <div className={styles.titleHolder}>
                <h2>{poll.title}</h2>
            </div>
            <div className={styles.type}>
                <h4>Event: {poll.event.title}</h4>
            </div>
            <p>Type: <span>{poll.type}</span></p>
            <p>Created by: <span>{poll.createdBy.displayName}</span></p>
            <p>Votes: <span>{poll.votes.length}</span></p>
            <p>Created: <span>{moment(poll.createdAt).format('DD.MM.YYYY')}</span></p>
            <p>Edited: <span>{moment(poll.editedAt).format('DD.MM.YYYY')}</span></p>
        </div>
    )
}

export default PollCard;