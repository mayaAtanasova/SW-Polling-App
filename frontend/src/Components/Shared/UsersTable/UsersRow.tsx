import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useMySelector, useMyDispatch } from '../../../hooks/useReduxHooks';
import eventService from '../../../services/eventService';

import Avatar from '../Avatar/Avatar';

import styles from './UsersTable.module.css';
import { faEdit } from '@fortawesome/free-regular-svg-icons';
import { faCheck, faPencil } from '@fortawesome/free-solid-svg-icons';

type componentProps = {
    user: {
        id: string,
        displayName: string,
        email: string,
        vpoints: number,
    },
}

const UsersRow = ({ user }: componentProps) => {

    const { isAdmin } = useMySelector(state => state.auth);
    const dispatch = useMyDispatch();

    const [editState, setEditState] = useState(false);
    const [vPoints, setVPoints] = useState(user.vpoints);

    const handleVPointsEdit = () => {
        setEditState(true);
    }

    const handleVPointsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setVPoints(Number(e.target.value));
    }

    const handleVPointsSave = async (ev: any) => {
        const updatedUser = await eventService.editUserVpoints({ userId: user.id, vpoints: vPoints });
        setEditState(false);
    }

    return (
        (
            <tr key={user.id}>
                <td><Avatar displayName={user.displayName} /></td>
                <td>{user.displayName}</td>
                <td>{user.email}</td>
                <td>
                    {editState
                        ? <input type="number" min="1" value={vPoints} onChange={handleVPointsChange} />
                        : <span>{vPoints}</span>
                    }
                                    {isAdmin &&
                    <span>
                        {!editState
                        ? <span
                            onClick={handleVPointsEdit}>
                            <FontAwesomeIcon icon={faPencil} />
                        </span>
                        : <span
                            onClick={handleVPointsSave}>
                            <FontAwesomeIcon icon={faCheck} />
                        </span>
                        }
                    </span>}
                </td>

            </tr>
        )
    )
}

export default UsersRow