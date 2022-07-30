import { useState } from 'react';
import EventsTab from '../../Components/AdminTabs/EventsTab/EventsTab';
import PollsTab from '../../Components/AdminTabs/PollsTab/PollsTab';

import styles from './AdminDashboard.module.css';

const AdminDashboard = () => {

  const [activeTab, setActiveTab] = useState('events');
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