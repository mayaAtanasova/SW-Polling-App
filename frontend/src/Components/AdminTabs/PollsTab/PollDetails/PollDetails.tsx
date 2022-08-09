
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment';
import { useEffect } from 'react';
import { IPoll, IPollCompact } from '../../../../Interfaces/IPoll';
import styles from './PollDetails.module.css';

type componentProps = {
  poll: IPollCompact,
  onDetailsClose: (pollId: string) => (ev: any) => void,
  // handleEditPoll: (pollId: string) => void,
}

const PollDetails = ({ poll, onDetailsClose }: componentProps) => {
  
  useEffect (() => {
    console.log('poll details', poll);
    console.log(poll.votes[0]);
  }, []) 
  return (
    <div className={styles.pollDetailsBkg} >
      <div className={styles.pollDetailsWrapper}>
        <div className={styles.pollDetailsTitle}>
          <h2>{poll.title}</h2>
        </div>
        <div className={styles.pollDetailsDescription}>
          <h4>In event: <span>{poll.event.title}</span></h4>
          <h4>Poll type: <span>{poll.type}</span></h4>
        </div>
        <p>Created by: <span>{poll.createdBy.displayName}</span></p>
        <p>Created on: <span>{moment(poll.createdAt).format('DD.MM.YYYY')}</span></p>
        <p>Edited on: <span>{moment(poll.editedAt).format('DD.MM.YYYY')}</span></p>
        <div className={styles.divider}></div>
        <h3>Votes: </h3>
        {poll.votes.length < 1 && <h4>No one has voted yet.</h4>}
        <div className={styles.voteTableWrapper}>
          {poll.votes.length > 0 &&
          <table className={styles.votesTable}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Vote</th>
              <th>Vpoints</th>
            </tr>
          </thead>
          <tbody>
            {poll.votes.map((vote: any, index:number) => (
            <tr key={index}>
              <td>{vote.user.displayName}</td>
              <td>{vote.option}</td>
              <td>{vote.user.vpoints}</td>
            </tr>
            ))}
            </tbody>
            </table>
            }
        </div>
        <div className={styles.divider}></div>
        <button className={styles.closeBtn} onClick={onDetailsClose(poll._id)}>
          <FontAwesomeIcon icon={faClose} />
        </button>
      </div>
    </div>
  )
}

export default PollDetails;