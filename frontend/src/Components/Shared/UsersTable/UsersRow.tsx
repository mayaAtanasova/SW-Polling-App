import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useMySelector, useMyDispatch } from '../../../hooks/useReduxHooks';
import eventService from '../../../services/eventService';

import Avatar from '../Avatar/Avatar';

import styles from './UsersRow.module.css';
import { faAngleDown, faAngleUp, faCheck, faPencil } from '@fortawesome/free-solid-svg-icons';
import { IUserCompact } from '../../../Interfaces/IUser';
import { setUserVPoints } from '../../../store/eventSlice';

type componentProps = {
    user: IUserCompact,
    handleEditUser?: (user: IUserCompact) => void,
}

const UsersRow = ({ user, handleEditUser }: componentProps) => {

    const { isAdmin } = useMySelector(state => state.auth);
    const { event } = useMySelector(state => state.event);
    const dispatch = useMyDispatch();

    const [editState, setEditState] = useState(false);
    const [vPoints, setVPoints] = useState(user.vpoints);

    const handleVPointsEdit = () => {
        setEditState(true);
    }

    const increasePoints = () => {
        const newPoints = vPoints <= 9 ? vPoints + 1 : 10;
        setVPoints(newPoints);
    }

    const decreasePoints = () => {
        const newPoints = vPoints >= 2 ? vPoints - 1 : 1;
        setVPoints(newPoints);
    }

    const handleVPointsSave = async (ev: any) => {
        ev.stopPropagation();
        if (vPoints !== user.vpoints) {
            const updatedUser: IUserCompact = await eventService.editUserVpoints({ userId: user.id, vpoints: vPoints });
            if (updatedUser && handleEditUser) {
                handleEditUser(updatedUser);
            }
            const userInCurrentEvent = event.attendees.find(attendee => attendee.id === user.id);
            if (userInCurrentEvent) {
                dispatch(setUserVPoints(updatedUser));
            }
        }
        setEditState(false);
    }

    return (
        (
            <tr key={user.id}>
                <td><Avatar displayName={user.displayName} /></td>
                <td>{user.displayName}</td>
                <td>{user.email}</td>
                <td>
                    <div className={styles.pointsGroup}>
                        <span className={styles.pointsHolder}>{vPoints}</span>
                        {!editState && <div className={styles.placeholder}></div>}
                        {editState && <span className={styles.arrowsGroup}>
                            <button><FontAwesomeIcon icon={faAngleUp} onClick={increasePoints} /></button>
                            <button><FontAwesomeIcon icon={faAngleDown} onClick={decreasePoints} /></button>
                        </span>}
                        {isAdmin &&
                            <span>
                                {!editState
                                    ? <button
                                        className={styles.editBtn}
                                        onClick={handleVPointsEdit}>
                                        <FontAwesomeIcon icon={faPencil} />
                                    </button>
                                    : <button
                                        className={styles.confirmBtn}
                                        onClick={handleVPointsSave}>
                                        <FontAwesomeIcon icon={faCheck} />
                                    </button>
                                }
                            </span>}
                    </div>
                </td>

            </tr>
        )
    )
}

export default UsersRow;