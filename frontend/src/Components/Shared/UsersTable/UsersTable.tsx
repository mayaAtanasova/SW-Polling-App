import { useRef, useContext, useEffect } from 'react';

import { IUserCompact } from '../../../Interfaces/IUser';

import UsersRow from './UsersRow';

import styles from './UsersTable.module.css';

type componentProps = {
  users: IUserCompact[],
  onEditUser?: (user: IUserCompact) => void,
}


const UsersTable = ({ users, onEditUser }: componentProps) => {

  const lastAttendeeRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (lastAttendeeRef.current) {
      lastAttendeeRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(scrollToBottom, [users]);


  return (
    <div className={styles.usersTableWrapper}>
      <table className={styles.usersTable}>
        <thead>
          <tr>
            <th></th>
            <th>Name</th>
            <th>Email</th>
            <th>VPoints</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => <UsersRow key={user.id} user={user} handleEditUser={onEditUser} />)}
          <div className={styles.refDiv} ref={lastAttendeeRef}></div>
        </tbody>
      </table>
    </div>
  )
}

export default UsersTable;