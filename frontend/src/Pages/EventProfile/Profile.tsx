import { useEffect, useState, useContext } from 'react';

import { useMySelector, useMyDispatch } from '../../hooks/useReduxHooks';
import { fetchEvent } from '../../store/eventSlice';
import { SocketContext } from '../../store/socketContext';

import UsersTable from '../../Components/Shared/UsersTable/UsersTable';

import styles from './Profile.module.css';

const Profile = () => {

  const socket = useContext(SocketContext);
  const [ loading, setLoading ] = useState(false);
  const { user } = useMySelector((state: any) => state.auth);
  const { event, eventId, loggedInChat } = useMySelector((state: any) => state.event);
  const userId = user?.id;
  const title = event?.title;
  const displayName = user?.displayName;
  const dispatch = useMyDispatch();

  useEffect(() => {
    if (!socket) return;
    socket.on('fetch event data', fetchEventData);
    if (loggedInChat && !title) { 
        const title = localStorage.getItem('eventTitle');
        socket.emit('join event', { userId, displayName, title });
    }
    fetchEventData();
}, [socket]);

  const fetchEventData = () => {
    console.log('fetching event data');
    console.log('eventid ' + eventId);
    dispatch(fetchEvent(eventId!));
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className={styles.profileContainer}>
      <img src="/assets/hero_bkg.png" alt="" />
      {event && <>
        <h1>
          {event.title}
        </h1>
        <h3>
          {event.description}
        </h3>
        <h4>
          Hosted by {event.host}
        </h4>
        <div className={styles.userDetails}>
          <p>
            you are attending as <span>{user.displayName}</span>
          </p>
          <p>Your voting points: <span>{user.vpoints}</span></p>
        </div>
        <div className={styles.attendeeList}>
          <div className={styles.attendeeHeading}>
            <h3>People in attendance:</h3>
          </div>
          {event.attendees.length === 0 && <h4>No one is attending yet.</h4>}
          {event.attendees.length > 0 &&
            <UsersTable users={event.attendees} />
          }

        </div>
      </>}
    </div>
  )
}

export default Profile;