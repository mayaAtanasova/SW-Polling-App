import { useState } from "react";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { IMessage } from "../../Interfaces/IMessage"
import { useMySelector } from "../../hooks/useReduxHooks";

import styles from "./Message.module.css";
import { faCheck, faCheckCircle, faX } from "@fortawesome/free-solid-svg-icons";

type messageComponentProps = {
    message: IMessage,
}

const Message = ({ message }: messageComponentProps) => {

    const [showActions, setShowActions] = useState(false);
    const { user: {id}, isAdmin } = useMySelector((state: any) => state.auth);
    const postDate = moment(message.date).format('hh:mm a');

    const onShowActions = () => {
        setShowActions(true);
    }

    const onHideActions = () => {
        setShowActions(false);
    }

    return (
        <div
            className={`${styles.messageWrapper} ${id === message.userId ? styles.myMessage : styles.otherMessage}`}
            onMouseEnter={onShowActions}
            onMouseLeave={onHideActions}
        >
            <p>{message.username}</p>
            <div>{message.text}</div>
            <div className={styles.msgDateGroup}>
                { isAdmin && <div className={`${styles.actionsGroup} ${showActions && styles.visible} `}>
                    <FontAwesomeIcon className={styles.actionBtn} icon={faCheck} />
                    <FontAwesomeIcon className={styles.actionBtn} icon={faX} />
                </div>}
                <p>{postDate}</p>
            </div>

        </div>
    )
}

export default Message