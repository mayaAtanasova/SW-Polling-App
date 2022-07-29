import { useMySelector } from '../../hooks/useReduxHooks';
import { genColor } from '../../helpers/colorGenerator';

import styles from './Profile.module.css';
import { useEffect } from 'react';

const Profile = () => {

  const { user } = useMySelector((state: any) => state.auth);
  const { loading, event } = useMySelector((state: any) => state.event);
  const bkgColor = genColor();

  useEffect(() => {
    console.log(event);
  }, [])

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
        <h3>Attendes:</h3>
        {event.attendees.map((attendee: any) =>

          <div className={styles.attendee} key={attendee.id}>
            <span className={styles.profileLogo} style={{ 'backgroundColor': genColor() }} >
              {attendee.displayName.split(' ').map((name: any) => name[0].toUpperCase()).join('')}
            </span>
            <div >{attendee.displayName}</div>
            <div>vpoints: {attendee.vpoints}</div>
          </div>
        )}

      </div>
    </div>
  )
}

export default Profile;