import { IUser, IUserCompact } from '../../../Interfaces/IUser';
import UsersRow from './UsersRow';
import styles from './UsersTable.module.css';

type componentProps = {
  users: IUserCompact[],
  onEditUser?: (user:IUserCompact) => void,
}


const UsersTable = ({ users, onEditUser }: componentProps) => {


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
          {users.map(user => <UsersRow key={user.id} user={user} handleEditUser={onEditUser}/>)}
        </tbody>
      </table>
    </div>
  )
}

export default UsersTable;