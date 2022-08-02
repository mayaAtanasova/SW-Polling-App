import { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';

import { useMyDispatch, useMySelector } from '../../hooks/useReduxHooks';

import EventsTab from '../../Components/AdminTabs/EventsTab/EventsTab';
import PollsTab from '../../Components/AdminTabs/PollsTab/PollsTab';

import styles from './AdminDashboard.module.css';
import IRootState from '../../Interfaces/IRootState';
import { fetchEvent } from '../../store/eventSlice';

type componentProps = {
  socket: Socket | null,
};

const AdminDashboard = ({ socket }: componentProps) => {

  const dispatch = useMyDispatch();
  const { loggedInChat, eventId, event } = useMySelector((state: IRootState) => state.event);
  const title = event?.title;

  const { user } = useMySelector(state => state.auth);
  const userId = user?.id;
  const displayName = user?.displayName;

  const [activeTab, setActiveTab] = useState('events');

  useEffect(() => {
    if (!socket) return;
    if (loggedInChat && !title) {
      const title = localStorage.getItem('eventTitle');
      socket.emit('joinEvent', { userId, displayName, title });
    }
  }, [socket]);

  return (
    <div className={styles.dashboardWrapper}>
      <ul className={styles.adminNav}>
        <li
          className={`${styles.adminNavItem} ${activeTab === 'events' ? styles.active : ''}`}
          onClick={() => setActiveTab('events')}
        >
          Events
        </li>
        <li
          className={`${styles.adminNavItem} ${activeTab === 'polls' ? styles.active : ''}`}
          onClick={() => setActiveTab('polls')}
        >
          Polls
        </li>
      </ul>
      <div className={styles.outlet}>
        {activeTab === 'events' && <EventsTab />}
        {activeTab === 'polls' && <PollsTab />}
      </div>
    </div>
  )
};

export default AdminDashboard;