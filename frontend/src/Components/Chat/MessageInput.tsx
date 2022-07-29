import { useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faPencil } from '@fortawesome/free-solid-svg-icons';
import styles from './MessageInput.module.css';

type inputComponentProps = {
    onChatMessage: (message: string) => (ev: any) => void,
}

const MessageInput = ({ onChatMessage }: inputComponentProps) => {

    const [message, setMessage] = useState('');

    const onInputMessage = (ev: any) => {
        setMessage(ev.target.value);
    }

    return (
        <form
            className={styles.messageForm}
            onSubmit={onChatMessage(message)}
        >
            <div className={styles.faIconContainer}>
                <FontAwesomeIcon className={styles.faIcon} icon={faPencil} />
            </div>
            <input
                className={styles.messageInput}
                type="text"
                placeholder="Type your question or comment here..."
                onChange={onInputMessage} />
            <button
                className={styles.messageButton}
                type="submit"
            >
                <FontAwesomeIcon className={styles.faIcon} icon={faPaperPlane} />
                Send
            </button>
        </form>
    )
}

export default MessageInput