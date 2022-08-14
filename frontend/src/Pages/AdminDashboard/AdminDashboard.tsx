import { useEffect, useState, useContext } from 'react';

import EventsTab from '../../Components/AdminTabs/EventsTab/EventsTab';
import PollsTab from '../../Components/AdminTabs/PollsTab/PollsTab';

import { useMySelector } from '../../hooks/useReduxHooks';
import { RootState } from '../../store/store';
import { SocketContext } from '../../store/socketContext';

import styles from './AdminDashboard.module.css';

const AdminDashboard = () => {

  const socket = useContext(SocketContext);
  const { loggedInChat, event } = useMySelector((state: RootState) => state.event);
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
  }, []);

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