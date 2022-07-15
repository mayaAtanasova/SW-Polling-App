import React from 'react'
import { useMySelector } from '../../hooks/useReduxHooks';
import styles from './Profile.module.css';

const Profile = () => {

  const { user } = useMySelector((state: any) => state.auth);

  return (

    <div className={styles.profileContainer}>
      <h1>
        {`${user.displayName}'s profile`}
      </h1>
      <div className={styles.profileLogo}>
        <h2>
          {user.displayName.split(' ').map((name: any) => name[0].toUpperCase()).join('')}
        </h2>
      </div>
    </div>

  )
}

export default Profile;