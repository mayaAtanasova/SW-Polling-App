import { useMySelector } from '../../../hooks/useReduxHooks';
import { IPoll } from '../../../Interfaces/IPoll';

import styles from './PollItem.module.css';

type componentProps = {
    poll: IPoll,
    onPollClicked: (pollId: string) => (ev: any) => void,
}
const Poll = ({ poll, onPollClicked }: componentProps) => {

    const { _id, title, votes } = poll;
    const { user: { id } } = useMySelector(state => state.auth);
    const voted = votes && votes.some(vote => vote.user._id === id);

    if (!_id) return <p>Loading...</p>
    return (
        <div
            className={`${styles.pollItem} ${voted && styles.voted}`}
            onClick={onPollClicked(_id)}>
            <h3>{title}</h3>
            <div className={styles.pollActions}>
                {voted && <p>You have voted</p> }
            </div>
        </div>
    )
}

export default Poll;