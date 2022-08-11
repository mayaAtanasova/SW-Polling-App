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
const sortingMethods = {
  titleAsc: { method: (a: IPollCompact, b: IPollCompact) => a.event.title.localeCompare(b.event.title) },
  titleDesc: { method: (a: IPollCompact, b: IPollCompact) => b.event.title.localeCompare(a.event.title) },
  dateAsc: { method: (a: IPollCompact, b: IPollCompact) => Date.parse(b.createdAt) - Date.parse(a.createdAt) },
  dateDesc: { method: (a: IPollCompact, b: IPollCompact) => Date.parse(a.createdAt) - Date.parse(b.createdAt) },
}

const filteringMethods = {
  activeOnly: { method: (poll: IPollCompact) => !poll.locked },
  lockedOnly: { method: (poll: IPollCompact) => poll.locked },
  all: { method: (poll: IPollCompact) => true },
}

type T = keyof typeof sortingMethods;
type U = keyof typeof filteringMethods;

const PollsTab = ({ socket }: componentProps) => {
  const [showPollForm, setShowPollForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [polls, setPolls] = useState<IPollCompact[]>([]);
  const [sortType, setSortType] = useState<T>('titleAsc');
  const [filterType, setFilterType] = useState<U>('all');
  const [events, setEvents] = useState<IEventCompact[]>([]);
  const [currentPoll, setCurrentPoll] = useState<IPollCompact | null>(null);
  const { user } = useMySelector(state => state.auth);
  const userId = user?.id;
  const { eventId } = useMySelector(state => state.event);

  const dispatch = useMyDispatch();

  useEffect(() => {
    getAdminUserPolls();
    getAdminEvents();
  }, []);

  useEffect(() => {
    console.log(currentPoll);
  }, [currentPoll]);

  useEffect(() => {
    if (!socket) return;
    socket.on('fetch polls', (title:string) => getCurrentPollStatus(title));
}, [socket]);

  const getAdminUserPolls = () => {
    console.log('getting polls in polls tab')
    if (userId) {
      setLoading(true);
      pollsService
        .getPollsByCreator(userId)
        .then((data) => {
          if (data) {
            setPolls(data.polls);
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

  const getCurrentPollStatus = (title:string) => {
    console.log('getting current poll status details')
    const currentPollId = currentPoll?._id;
    setLoading(true);
    // if (title === currentPoll?.event.title) {
    //   const pollId = currentPoll._id;
    //   pollsService
    //     .getPollbyId(pollId)
    //     .then((data) => {
    //       if (data) {
    //         console.log(data);
    //         setCurrentPoll(data);
    //         setLoading(false);
    //       }
    //     })
    //     .catch(err => {
    //       dispatch(setMessage(err.message));
    //       setLoading(false);
    //     });
    // } else {
    //   setLoading(false);
    // }
    pollsService.getPollsByEvent(eventId!)
      .then((data) => {
        if (data) {
          console.log(data.polls);
          const newCurrentPoll = data.polls.find((poll:IPollCompact) => poll._id === currentPollId);
          setCurrentPoll(newCurrentPoll);
          const foreignPolls = polls.filter(poll => poll.event._id !== eventId);
          console.log(foreignPolls);
          const newPolls = foreignPolls.concat(data.polls);
          console.log(newPolls);
          setPolls(newPolls);
        }
      }).catch(err => {
        dispatch(setMessage(err.message));
        setLoading(false);
      }).finally(() => {
        setLoading(false);
      })
  }

  const revealPollForm = (event: any) => {
    event.preventDefault();
    setShowPollForm(true);
  }

  const hidePollForm = (successfulPublish: boolean, eventId: string) => {
    console.log('i should close the form');
    setShowPollForm(false);
    if (successfulPublish) {
      const eventTitle = events.find((event: IEventCompact) => event.id === eventId)?.title;
      socket?.emit('new poll published', eventTitle);
      getAdminUserPolls();
    }
  }

  const selectPoll = (pollId: string) => (ev: any) => {
    ev.preventDefault();
    const selectedPoll = polls.find(poll => poll._id === pollId);
    if (selectedPoll) {
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

      {showPollForm && <PollForm hidePollForm={hidePollForm} events={events} />}


      <div className={styles.divider}></div>

      {!polls && <p>You have not created any polls yet.</p>}
      <h2>You have created the following polls</h2>
      <div className={styles.sortActionsHolder}>
        <div> 
          <h4>Sort polls by event and date: </h4>
          <button type="button" className={sortType === 'titleAsc' ? styles.sortSelected : ''} onClick={() => setSortType('titleAsc')}>Sort by Event Asc</button>
          <button type="button" className={sortType === 'titleDesc' ? styles.sortSelected : ''} onClick={() => setSortType('titleDesc')}>Sort by Event Desc</button>
          <button type="button" className={sortType === 'dateAsc' ? styles.sortSelected : ''} onClick={() => setSortType('dateAsc')}>Sort newest first</button>
          <button type="button" className={sortType === 'dateDesc' ? styles.sortSelected : ''} onClick={() => setSortType('dateDesc')}>Sort oldest first</button>
        </div>
        <div>
          <h4>Filter polls by status: </h4>
        <button type="button" className={filterType === 'all' ? styles.sortSelected : ''} onClick={() => setFilterType('all')}>Show all polls</button>
        <button type="button" className={filterType === 'activeOnly' ? styles.sortSelected : ''} onClick={() => setFilterType('activeOnly')}>Show active only</button>
        <button type="button" className={filterType === 'lockedOnly' ? styles.sortSelected : ''} onClick={() => setFilterType('lockedOnly')}>Show inactive only</button>
      </div>
      </div>
      <p>Click on a poll for details</p>

      <div className={styles.pollsHolder}>
        {polls && polls.sort(sortingMethods[sortType].method).filter(filteringMethods[filterType].method).map((poll: any) => {
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