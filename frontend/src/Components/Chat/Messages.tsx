import { useEffect } from "react";
import { Socket } from "socket.io-client";
import { useMySelector, useMyDispatch } from "../../hooks/useReduxHooks";
import messageService from '../../services/messageService'
import { IMessage } from "../../Interfaces/IMessage";
import styles from "./Messages.module.css";
import Message from "./Message";

type componentProps = {
  messages: IMessage[],
};

const Chat = ({ messages }: componentProps) => {

  const dispatch = useMyDispatch();
  const { user } = useMySelector((state: any) => state.auth);
  const userId = user.id;
  const { loading, event, eventId } = useMySelector((state: any) => state.event);
  const {
    title,
    attendees,
  } = event;




  return (
    <div className={styles.chatWrapper}>
      <div className={styles.chatHeading}>
        <h4>CHAT AREA</h4>
      </div>
      <div className={styles.messageArea}>
        {messages &&
          messages.map((message: any) => (
            <Message key={message.id} message={message}/>
          ))}
      </div>
    </div>
  )
}

export default Chat