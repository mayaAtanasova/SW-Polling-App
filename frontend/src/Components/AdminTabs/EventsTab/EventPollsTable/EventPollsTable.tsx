import { IPoll } from '../../../../Interfaces/IPoll';
import styles from './EventPollsTable.module.css';

type componentProps = {
    polls: IPoll[],
}

const EventPollsTable = ({ polls }: componentProps) => {
    return (
        <div className={styles.pollsTableWrapper}>
            <table className={styles.pollsTable}>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Type</th>
                        <th>Voted</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        polls && polls.map(poll => (
                            <tr key={poll._id}>
                                <td>{poll.title}</td>
                                <td>{poll.type}</td>
                                <td>
                                {poll.votes.length === 0 && <span>No one has voted yet.</span>}
                                {poll.votes.length > 0 && 
                                (
                                    <ul>
                                        {poll.votes.map(vote => (
                                            <li key={vote._id}>{vote.user.displayName} - {vote.option}</li>
                                        ))}
                                    </ul>
                                )}
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    )
}

export default EventPollsTable;