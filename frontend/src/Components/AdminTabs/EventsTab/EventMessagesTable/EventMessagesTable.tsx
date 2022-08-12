import moment from 'moment';
import messageService from '../../../../services/messageService';
import { IMessage } from '../../../../Interfaces/IMessage'

import styles from './EventMessagesTable.module.css';
import { useMyDispatch } from '../../../../hooks/useReduxHooks';
import { setMessage } from '../../../../store/messageSlice';

type componentProps = {
    messages: IMessage[],
    answered: boolean,
    onRestoreMessage?: () => void,
}

const EventMessagesTable = ({ messages, answered, onRestoreMessage }: componentProps) => {
    const dispatch = useMyDispatch();

    const onRestoreClicked = (messageId: string) => async (ev:any) => {
        ev.preventDefault();
        ev.stopPropagation();
        console.log(messageId);
        const restoredMessage = await messageService.restoreMessage(messageId);
        if(restoredMessage && restoredMessage.success) {
            console.log('message restored');
            onRestoreMessage?.();
        } else {
            dispatch(setMessage(restoredMessage?.message));
        }
    }
    
    return (
        <div className={styles.messagesTableContainer}>
            <h5>{answered ? "Answered messages" : "Open messages"}</h5>
            {messages.length === 0 && (answered ? <p>No answered messages at the moment.</p> : <p>No open messages at the moment.</p>)}
            {messages.length > 0 && (
                <table className={styles.eventMessagesTable}>
                    <thead>
                        <tr>
                            <th>Sender</th>
                            <th>Message</th>
                            <th>Time</th>
                            {answered && <th>Action</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {messages.map(message => (
                            <tr
                                key={message._id}>
                                <td>{message.username}</td>
                                <td>{message.text}</td>
                                <td>{moment(message.date).format('HH:mm')}</td>
                                {answered && (
                                    <td>
                                        <button
                                        onClick={onRestoreClicked(message._id!)}
                                        >
                                            Restore
                                        </button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    )
}

export default EventMessagesTable;