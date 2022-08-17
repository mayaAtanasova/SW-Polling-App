
import { hover } from '@testing-library/user-event/dist/hover';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { IPoll, IPollCompact } from '../../../../Interfaces/IPoll';

import styles from './PollCard.module.css'

type componentProps = {
    poll: IPollCompact,
    onSelectPollDetails: (pollId: string) => (ev: any) => void,
    onSelectDuplicatePoll: (pollId: string) => (ev: any) => void,
}

const PollCard = ({ 
    poll, 
    onSelectPollDetails,
    onSelectDuplicatePoll,
 }: componentProps) => {

const [hovering, setHovering] = useState(false);

useEffect(() => {
    console.log(hovering);
}, [hovering]);

    return (
        <div
            className={`${styles.pollCard} ${poll.concluded ? styles.concludedPoll : ''}`}
            onMouseEnter={e => setHovering(true)}
            onMouseLeave={e => setHovering(false)}
            >
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

            <div
                className={hovering ? styles.cardActionsGroup : styles.cardActionsGroupHidden}
            >
                {poll.votes.length === 0 && <button className={styles.editBtn}>Edit</button>}
                {poll.concluded && <button className={styles.deleteBtn}>Delete</button>}
                <button onClick={onSelectPollDetails(poll._id)}>Details</button>
                <button onClick={onSelectDuplicatePoll(poll._id)}>Duplicate</button>
            </div>
        </div>

    )
}

export default PollCard;