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
import ConfirmDialog from '../../Shared/ConfirmDialog/ConfirmDialog';

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
  const dispatch = useMyDispatch();
  const { user } = useMySelector(state => state.auth);
  const userId = user?.id;

  const [loading, setLoading] = useState(false);
  const [showPollForm, setShowPollForm] = useState(false);
  const [polls, setPolls] = useState<IPollCompact[]>([]);
  const [sortType, setSortType] = useState<T>('dateAsc');
  const [filterType, setFilterType] = useState<U>('activeOnly');
  const [events, setEvents] = useState<IEventCompact[]>([]);
  const [currentPoll, setCurrentPoll] = useState<IPollCompact | null>(null);
  const [selectedPoll, setSelectedPoll] = useState<IPollCompact | undefined>(undefined);
  const [mode, setMode] = useState<'create' | 'edit' | 'duplicate'>('create');
  const [searchString, setSearchString] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState('');

  const { event } = useMySelector(state => state.event);
  const [selectedEventTitle, setSelectedEventTitle] = useState(event.title || '');

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


  //Poll Form Action Handlers
  const hidePollForm = (successfulPublish: boolean, eventId?: string) => {
    console.log('i should close the form');
    setMode('create');
    setShowPollForm(false);
    setSelectedPoll(undefined);
    if (successfulPublish) {
      const eventTitle = events.find((event: IEventCompact) => event.id === eventId)?.title;
      socket?.emit('new poll published', eventTitle);
      getAdminUserPolls();
    }
  }

  const handleSelectPollDetails = (pollId: string) => (ev: any) => {
    ev.preventDefault();
    const selectedPoll = polls.find(poll => poll._id === pollId);
    if (selectedPoll) {
      setCurrentPoll(selectedPoll);
    }
  }

  const handleDuplicatePoll = (pollId: string) => (ev: any) => {
    ev.preventDefault();
    hidePollForm(false);
    const newSelectedPoll = polls.find(poll => poll._id === pollId);
    if (newSelectedPoll) {
      console.log(newSelectedPoll, selectedPoll);
      setSelectedPoll(newSelectedPoll);
      setMode('duplicate');
      setShowPollForm(true);
    }
  }

  const handleEditPoll = (pollId: string) => (ev: any) => {
    ev.preventDefault();
    const selectedPoll = polls.find(poll => poll._id === pollId);
    if (selectedPoll) {
      setSelectedPoll(selectedPoll);
      setMode('edit');
      setShowPollForm(true);
    }
  }

  const handleConcludePoll = (pollId: string) => (ev: any) => {
    ev.preventDefault();
    setModalAction('conclude');
    setIsModalOpen(true);
    const selectedPoll = polls.find(poll => poll._id === pollId);
    if (selectedPoll) {
      setSelectedPoll(selectedPoll);
    }
  }

  const handleReactivatePoll = (pollId: string) => (ev: any) => {
    ev.preventDefault();
    setModalAction('reactivate');
    setIsModalOpen(true);
    const selectedPoll = polls.find(poll => poll._id === pollId);
    if (selectedPoll) {
      setSelectedPoll(selectedPoll);
    }
  }

  const handleDeletePoll = (pollId: string) => (ev: any) => {
    ev.preventDefault();
    setModalAction('delete');
    setIsModalOpen(true);
    const selectedPoll = polls.find(poll => poll._id === pollId);
    if (selectedPoll) {
      setSelectedPoll(selectedPoll);
    }
  }

  const handleModalClose = (answer: boolean) => {
    setIsModalOpen(false);
    if (answer) {
      const pollToModifyId = selectedPoll?._id;

      if (pollToModifyId) {
        if (modalAction === 'conclude') {
          pollsService
            .concludePoll(pollToModifyId)
            .then((data) => {
              console.log(data);
              if (data.success) {
                dispatch(setMessage(data.message));
                socket?.emit('new poll published', selectedPoll.event.title);
                getAdminUserPolls();
              }
            })
            .catch(err => {
              dispatch(setMessage(err.message));
            });
        } else if (modalAction === 'reactivate') {
          pollsService
            .reactivatePoll(pollToModifyId)
            .then((data) => {
              console.log(data);
              if (data.success) {
                dispatch(setMessage(data.message));
                socket?.emit('new poll published', selectedPoll.event.title);
                getAdminUserPolls();
              }
            })
            .catch(err => {
              dispatch(setMessage(err.message));
            });
        } else if (modalAction === 'delete') {
          pollsService
            .deletePoll(pollToModifyId)
            .then((data) => {
              if (data.success) {
                dispatch(setMessage(data.message));
                socket?.emit('new poll published', selectedPoll.event.title);
                getAdminUserPolls();
              }
            })
            .catch(err => {
              dispatch(setMessage(err.message));
            });
        }
      }
    } else {
      setModalAction('');
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

      {showPollForm && <PollForm hidePollForm={hidePollForm} events={events} mode={mode} poll={selectedPoll} />}


      <div className={styles.divider}></div>

      <h2>YOUR POLLS</h2>


      <div className={styles.loadingWrapper}>

        {loading && <Loader />}

        {!loading && !polls && <p>You have not created any polls yet.</p>}

        {!loading && polls &&
          <div className={styles.sortActionsHolder}>
            <div className={styles.sortActionGroup}>
              <h4>Sort by: </h4>
              <div className={styles.buttonsContainer}>
                <button type="button" className={sortType === 'dateAsc' ? styles.sortSelected : ''} onClick={() => setSortType('dateAsc')}>Latest first</button>
                <button type="button" className={sortType === 'dateDesc' ? styles.sortSelected : ''} onClick={() => setSortType('dateDesc')}>Oldest first</button>
                <button type="button" className={sortType === 'titleAsc' ? styles.sortSelected : ''} onClick={() => setSortType('titleAsc')}>Event Asc</button>
                <button type="button" className={sortType === 'titleDesc' ? styles.sortSelected : ''} onClick={() => setSortType('titleDesc')}>Event Desc</button>
              </div>
            </div>
            <div className={styles.sortActionGroup}>
              <h4>Filter by: </h4>
              <div className={styles.buttonsContainer}>
                <button type="button" className={filterType === 'activeOnly' ? styles.sortSelected : ''} onClick={() => setFilterType('activeOnly')}>Active</button>
                <button type="button" className={filterType === 'concludedOnly' ? styles.sortSelected : ''} onClick={() => setFilterType('concludedOnly')}>Concluded</button>
                <button type="button" className={filterType === 'all' ? styles.sortSelected : ''} onClick={() => setFilterType('all')}>All</button>
                <select className={filterType === 'byEvent' ? styles.sortSelected : ''} >
                  <option value="" hidden defaultValue='By Event'>Event</option>
                  {events.map((event: IEventCompact) => <option key={event.id} value={event.title} onClick={handleSelectByEventTitle}>{event.title}</option>)}
                </select>
              </div>
            </div>
            <div className={styles.sortActionGroup}>
              <h4>Search by poll title: </h4>
              <input type="search" value={searchString} onChange={(ev) => setSearchString(ev.target.value)} />
              <button onClick={() => setSearchString('')}>Reset</button>
            </div>
            <p>Hover over poll for actios</p>
          </div>}

        {!loading &&
          <div className={styles.pollsHolder}>
            {polls && polls
              .sort(sortingMethods[sortType].method)
              .filter(filteringMethods[filterType].method)
              .filter(poll => poll.title.toLowerCase().includes(searchString.toLowerCase()))
              .map((poll: any) => {
                return (
                  <PollCard
                    key={poll._id}
                    poll={poll}
                    onSelectPollDetails={handleSelectPollDetails}
                    onSelectDuplicatePoll={handleDuplicatePoll}
                    onSelectEditPoll={handleEditPoll}
                    onSelectConcludePoll={handleConcludePoll}
                    onSelectDeletePoll={handleDeletePoll}
                    onSelectReactivatePoll={handleReactivatePoll}
                  />
                )
              })}
          </div>}

      </div>

      {currentPoll &&
        <PollDetails
          poll={currentPoll}
          onDetailsClose={handleDetailViewClose}
        // handleEditUser={handleEditUser}
        />}

      {isModalOpen && <ConfirmDialog itemType="poll" actionType={modalAction} onDialogClose={handleModalClose} />}

    </div>
  )
}

export default PollsTab;