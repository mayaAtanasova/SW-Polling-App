import { useEffect, useState, useContext } from 'react';

import pollsService from '../../../services/pollsService';
import eventsService from '../../../services/eventService';

import { useMyDispatch, useMySelector } from '../../../hooks/useReduxHooks';
import { setMessage } from '../../../store/messageSlice';
import { SocketContext } from '../../../store/socketContext';

import { IPollCompact } from '../../../Interfaces/IPoll';
import { IEventCompact } from '../../../Interfaces/IEvent';

import LargeButton from '../../UI/LargeButton/LargeButton';
import PollCard from './PollCard/PollCard';
import PollDetails from './PollDetails/PollDetails';
import PollForm from './PollForm/PollForm';

import styles from './PollsTab.module.css';
import Loader from '../../UI/Loader/Loader';

type SortingMethods = {
  [key: string]: { method: (a: IPollCompact, b: IPollCompact) => number }
}

type FilteringMethods = {
  [key: string]: { method: (poll: IPollCompact) => boolean }
}

type T = keyof SortingMethods;
type U = keyof FilteringMethods;

const PollsTab = () => {

  const socket = useContext(SocketContext);
  const [showPollForm, setShowPollForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [polls, setPolls] = useState<IPollCompact[]>([]);
  const [sortType, setSortType] = useState<T>('dateAsc');
  const [filterType, setFilterType] = useState<U>('activeOnly');
  const [events, setEvents] = useState<IEventCompact[]>([]);
  const [currentPoll, setCurrentPoll] = useState<IPollCompact | null>(null);
  const { user } = useMySelector(state => state.auth);
  const userId = user?.id;
  const { event } = useMySelector(state => state.event);
  const [selectedEventTitle, setSelectedEventTitle] = useState(event.title || '');

  const dispatch = useMyDispatch();

  useEffect(() => {
    if (!socket) return;
    socket.on('fetch polls', (title: string, pollId: string) => updatePolls(title, pollId));

    return () => {
      socket.off('fetch polls');
    }
  }, [socket]);

  useEffect(() => {
    getAdminUserPolls();
    getAdminEvents();
  }, []);

  useEffect(() => {
    console.log(currentPoll);
    const detailsViewOpen = !!currentPoll;
    const body = document.body;
    body.style.overflow = detailsViewOpen ? 'hidden' : 'auto';
  }, [currentPoll]);

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

  const updatePolls = async (title: string, pollId: string) => {
    console.log('received order to fetch polls in ' + title);
    if (title === event?.title) {
      console.log('updating polls for ' + title);
      await getCurrentPollStatus(pollId);
      getAdminUserPolls();
    }
  }

  const getCurrentPollStatus = async (pollId: string) => {
    console.log('getting current poll status details')
    const newPoll = await pollsService.getPollById(pollId);
    console.log(newPoll);
    if (newPoll) {
      setCurrentPoll(newPoll);
    }
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

  const sortingMethods: SortingMethods = {
    titleAsc: { method: (a: IPollCompact, b: IPollCompact) => a.event.title.localeCompare(b.event.title) },
    titleDesc: { method: (a: IPollCompact, b: IPollCompact) => b.event.title.localeCompare(a.event.title) },
    dateAsc: { method: (a: IPollCompact, b: IPollCompact) => Date.parse(b.createdAt) - Date.parse(a.createdAt) },
    dateDesc: { method: (a: IPollCompact, b: IPollCompact) => Date.parse(a.createdAt) - Date.parse(b.createdAt) },
  }

  const filteringMethods: FilteringMethods = {
    activeOnly: { method: (poll: IPollCompact) => !poll.concluded },
    concludedOnly: { method: (poll: IPollCompact) => poll.concluded },
    byEvent: { method: (poll: IPollCompact) => poll.event.title === selectedEventTitle },
    all: { method: (poll: IPollCompact) => true },
  }

  const handleSelectByEventTitle = (ev: any) => {
    ev.preventDefault();
    setSelectedEventTitle(ev.target.value);
    setFilterType('byEvent');
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

      <h2>YOUR POLLS</h2>


      <div className={styles.loadingWrapper}>

        {loading && <Loader />}

        {!loading && !polls && <p>You have not created any polls yet.</p>}

        {!loading && polls &&
          <div className={styles.sortActionsHolder}>
            <div className={styles.sortActionGroup}>
              <h4>Sort polls: </h4>
              <div className={styles.buttonsContainer}>
                <button type="button" className={sortType === 'dateAsc' ? styles.sortSelected : ''} onClick={() => setSortType('dateAsc')}>Latest first</button>
                <button type="button" className={sortType === 'dateDesc' ? styles.sortSelected : ''} onClick={() => setSortType('dateDesc')}>Oldest first</button>
                <button type="button" className={sortType === 'titleAsc' ? styles.sortSelected : ''} onClick={() => setSortType('titleAsc')}>By Event Asc</button>
                <button type="button" className={sortType === 'titleDesc' ? styles.sortSelected : ''} onClick={() => setSortType('titleDesc')}>By Event Desc</button>
              </div>
            </div>
            <div className={styles.sortActionGroup}>
              <h4>Filter polls: </h4>
              <div className={styles.buttonsContainer}>
                <button type="button" className={filterType === 'activeOnly' ? styles.sortSelected : ''} onClick={() => setFilterType('activeOnly')}>Active only</button>
                <button type="button" className={filterType === 'concludedOnly' ? styles.sortSelected : ''} onClick={() => setFilterType('concludedOnly')}>Concluded only</button>
                <button type="button" className={filterType === 'all' ? styles.sortSelected : ''} onClick={() => setFilterType('all')}>Show all</button>
                <select  className={filterType=== 'byEvent' ? styles.sortSelected : ''} >
                  <option value="" hidden selected>By Event</option>
                  {events.map((event: IEventCompact) => <option key={event.id} value={event.title} onClick={handleSelectByEventTitle}>{event.title}</option>)}
                </select>
              </div>
            </div>
            <p>Click on a poll for details</p>
          </div>}

        {!loading &&
          <div className={styles.pollsHolder}>
            {polls && polls.sort(sortingMethods[sortType].method).filter(filteringMethods[filterType].method).map((poll: any) => {
              return (<PollCard key={poll._id} poll={poll} onSelectPoll={selectPoll} />)
            })}
          </div>}

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