import { useEffect } from "react";
import { Socket } from "socket.io-client";
import { useMySelector, useMyDispatch } from "../../hooks/useReduxHooks";
import messageService from '../../services/messageService'
import { IMessage } from "../../Interfaces/IMessage";
import styles from "./Chat.module.css";

type componentProps = {
  socket: Socket | null,
};

const Chat = ({ socket }: componentProps) => {

  const dispatch = useMyDispatch();
  const { user } = useMySelector((state: any) => state.auth);
  const userId = user.id;
  const { loading, event, eventId } = useMySelector((state: any) => state.event);
  const {
    title,
    attendees,
    messages,
  } = event;

  // useEffect(() => {
  //   console.log("Chat component mounted " + messages[0].text);
  // }, [messages]);

  const sendChatMessage = (ev:any) => {
    ev.preventDefault();
    const messageInput = document.getElementById("chat-input") as HTMLInputElement;
    const newMessage: IMessage = {
      evid: eventId,
      text: messageInput.value,
      userId,
      username: user.displayName,
      date: new Date().toISOString(),
    }
    messageService.sendMessage(newMessage);
    socket?.emit("chat message", userId, title);
    messageInput.value = "";
  }

  return (
    <div className={styles.chatWrapper}>
      <h3>Event '{title}' Chat</h3>
      <div>Current attendees:
        {attendees.map((attendee: any) => (
          <div key={attendee.id}>{attendee.displayName}</div>
        ))}
      </div>
      <div> Messages:
        {messages && 
        messages.map((message: any) => (
          <div key={message.id}>{message.text}</div>
        ))}
      </div>
      <div>
        <input id="chat-input" type="text" />
        <button onClick={sendChatMessage} >Send</button>
      </div>
    </div>
  )
}

export default Chat