import { useMySelector } from '../../../hooks/useReduxHooks';
import { IPoll } from '../../../Interfaces/IPoll';

import styles from './PollItem.module.css';

type componentProps = {
    poll: IPoll,
    onPollClicked: (pollId: string, voted: boolean) => (ev: any) => void,
}
const Poll = ({ poll, onPollClicked }: componentProps) => {

    const { _id, title, votes } = poll;
    const { user: { id } } = useMySelector(state => state.auth);
    const voted = votes && votes.some(vote => vote.user._id === id);
    const concluded = poll.concluded;

    if (!_id) return <p>Loading...</p>
    return (
        <div
            className={`${styles.pollItem} ${voted && styles.voted} ${concluded && styles.voted}`}
            onClick={onPollClicked(_id, voted)}
            >
            <h3>{title}</h3>
            <div className={styles.pollActions}>
                {!concluded && voted && <p>You have voted</p> }
                {!concluded && !voted && <p>Vote now</p>}
                {concluded && <p>Concluded</p>}
            </div>
        </div>
    )
}

export default Poll;