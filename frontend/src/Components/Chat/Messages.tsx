import { useEffect, useRef } from "react";

import { IMessage } from "../../Interfaces/IMessage";
import Message from "./Message";

import styles from "./Messages.module.css";

type componentProps = {
  messages: IMessage[],
};

const Messages = ({ messages }: componentProps) => {
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(scrollToBottom, [messages]);

  return (
    <>
      <div className={styles.chatHeading}>
        <h4>CHAT AREA</h4>
      </div>
      <div className={styles.chatWrapper}>
        <div className={styles.messageArea}>
          {messages &&
            messages.map((message: any) => (
              <Message key={message.id} message={message} />
            ))}
          <div ref={messagesEndRef}></div>
        </div>
      </div>
    </>
  )
}

export default Messages