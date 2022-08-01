import UsersRow from './UsersRow';
import styles from './UsersTable.module.css';

type componentProps = {
  users: [{
    id: string,
    displayName: string,
    email: string,
    vpoints: number,
  }],
}


const UsersTable = ({ users }: componentProps) => {


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
          {users.map(user => <UsersRow key={user.id} user={user} />)}
        </tbody>
      </table>
    </div>
  )
}

export default UsersTable;