import moment from "moment";
import { IMessage } from "../../Interfaces/IMessage"
import styles from "./Message.module.css";

type messageComponentProps = {
    message: IMessage,
}

const Message = ({ message }: messageComponentProps) => {

    const postDate = moment(message.date).format('hh:mm a');
    return (
        <div className={`${styles.myMessage} ${styles.secondStyle}`}>
            <p>{message.username}</p>
        <div>{message.text}</div>
        <p className={styles.msgDate}>{postDate}</p>

        </div>
    )
}

export default Message