import { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';

import LargeButton from '../../UI/LargeButton/LargeButton';
import { useMyDispatch, useMySelector } from '../../../hooks/useReduxHooks';

import pollsService from '../../../services/pollsService';
import { setMessage } from '../../../store/messageSlice';
import { IUserCompact } from '../../../Interfaces/IUser';
import { IPoll } from '../../../Interfaces/IPoll';

import styles from './PollsTab.module.css';
import PollCard from './PollCard/PollCard';
import PollDetails from './PollDetails/PollDetails';
import PollForm from './PollForm/PollForm';

type componentProps = {
  socket: Socket | null,
}

const PollsTab = ({ socket }: componentProps) => {
  const [showPollForm, setShowPollForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [polls, setPolls] = useState<IPoll[]>([]);
  const [currentPoll, setCurrentPoll] = useState<IPoll | null>();
  const { user } = useMySelector(state => state.auth);
  const userId = user?.id;

  const dispatch = useMyDispatch();

  useEffect(() => {
    getCurrentPolls();
  }, []);

  const getCurrentPolls = () => { }

  const revealPollForm = (event: any) => {
    event.preventDefault();
    setShowPollForm(true);
}

const hidePollForm = () => {
  setShowPollForm(false);
  getCurrentPolls();
}

  const selectPoll = (pollId: string) => (ev:any) => { 
    ev.preventDefault();
    const selectedPoll = polls.find(poll => poll._id === pollId);
    if(selectedPoll) {
      setCurrentPoll(selectedPoll);
    }
  }

  const handleDetailViewClose = (pollId: string) => (ev: any) => {
    setCurrentPoll(null);
}

  return (
    <div className={styles.pollsTabWrapper}>

      <div className={styles.divider}></div>

      <div className={styles.newButtonHolder}>

        {!showPollForm && <LargeButton
          text="create new poll"
          onClick={revealPollForm}
        />}
      </div>

      {showPollForm && <PollForm hidePollForm={hidePollForm} />}


      <div className={styles.divider}></div>

      <h2>You have created the following polls</h2>
            <p>Click on a poll for details</p>
            {!polls && <p>You have not created any polls yet.</p>}
            <div className={styles.pollsHolder}>
                {polls && polls.map((poll: any) => {
                    return (<PollCard key={poll._id} poll={poll} onSelectPoll={selectPoll} />)
                })}
            </div>

            {currentPoll &&
                <PollDetails
                    poll={currentPoll}
                    onDetailsClose={handleDetailViewClose}
                    // handleEditUser={handleEditUser}
                />}

    </div>
  )
}

export default PollsTab;