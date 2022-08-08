import { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';

import LargeButton from '../../UI/LargeButton/LargeButton';
import { useMyDispatch, useMySelector } from '../../../hooks/useReduxHooks';

import pollsService from '../../../services/pollsService';
import eventsService from '../../../services/eventService';
import { setMessage } from '../../../store/messageSlice';
import { IUserCompact } from '../../../Interfaces/IUser';
import { IPoll, IPollCompact } from '../../../Interfaces/IPoll';

import styles from './PollsTab.module.css';
import PollCard from './PollCard/PollCard';
import PollDetails from './PollDetails/PollDetails';
import PollForm from './PollForm/PollForm';
import { IEventCompact } from '../../../Interfaces/IEvent';

type componentProps = {
  socket: Socket | null,
}

const PollsTab = ({ socket }: componentProps) => {
  const [showPollForm, setShowPollForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [polls, setPolls] = useState<IPollCompact[]>([]);
  const [events, setEvents] = useState<IEventCompact[]>([]);
  const [currentPoll, setCurrentPoll] = useState<IPollCompact | null>();
  const { user } = useMySelector(state => state.auth);
  const userId = user?.id;

  const dispatch = useMyDispatch();

  useEffect(() => {
    getCurrentPolls();
    getAdminEvents();
  }, []);

  const getCurrentPolls = () => {
    console.log('getting polls in polls tab')
    if (userId) {
        setLoading(true);
        pollsService
            .getPollsByCreator(userId)
            .then((data) => {
                if (data) {
                    setPolls(data.polls);
                    console.log(data.polls);
                    setLoading(false);
                }
            })
            .catch(err => {
                dispatch(setMessage(err.message));
                setLoading(false);
            });
    }
  }

  const getAdminEvents = () => {
    console.log('getting events in polls tab')
    if (userId) {
        setLoading(true);
        eventsService
            .getEventsByCreator(userId)
            .then((data) => {
                if (data) {
                    setEvents(data.events);
                    setLoading(false);
                }
            })
            .catch(err => {
                dispatch(setMessage(err.message));
                setLoading(false);
            });
    }
};

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