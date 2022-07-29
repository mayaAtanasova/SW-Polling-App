import moment from "moment";
import { IMessage } from "../../Interfaces/IMessage"
import { useMySelector } from "../../hooks/useReduxHooks";
import styles from "./Message.module.css";

type messageComponentProps = {
    message: IMessage,
}

const Message = ({ message }: messageComponentProps) => {

    const { id } = useMySelector((state: any) => state.auth.user);

    const postDate = moment(message.date).format('hh:mm a');
    return (
        <div className={`${styles.messageWrapper} ${id === message.userId ? styles.myMessage : styles.otherMessage }`}>
            <p>{message.username}</p>
        <div>{message.text}</div>
        <p className={styles.msgDate}>{postDate}</p>

        </div>
    )
}

export default Message