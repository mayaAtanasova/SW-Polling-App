import Avatar from '../../Components/Shared/Avatar/Avatar';
import UsersTable from '../../Components/Shared/UsersTable/UsersTable';
import { useMySelector } from '../../hooks/useReduxHooks';
import { IUserCompact } from '../../Interfaces/IUser';

import styles from './Profile.module.css';

const Profile = () => {

  const { user } = useMySelector((state: any) => state.auth);
  const { loading, event } = useMySelector((state: any) => state.event);

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className={styles.profileContainer}>
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
    </div>
  )
}

export default Profile;