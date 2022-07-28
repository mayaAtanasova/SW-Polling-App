import { useEffect } from "react";
import { Socket } from "socket.io-client";
import { useMySelector, useMyDispatch } from "../../hooks/useReduxHooks";
import { leaveEvent } from "../../store/eventSlice";

import styles from "./Chat.module.css";

type componentProps = {
  socket: Socket | null,
};

const Chat = ({ socket }: componentProps) => {

  const dispatch = useMyDispatch();
  const { user } = useMySelector((state: any) => state.auth);
  const userId = user.id;
  const { event, eventId } = useMySelector((state: any) => state.event);
  const {
    title,
    attendees,
    messages,
  } = event;

  useEffect(() => {
    console.log("Chat component mounted " + messages[0].text);
  }, [messages]);

  const onLeaveEvent = () => {
    console.log('leaving event');
    socket?.emit('leaveEvent', { eventId, userId });
    dispatch(leaveEvent({ eventId, userId }));
  }

  if (!event.title) {
    return <div>Loading...</div>
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
        {messages && messages.map((item: any) => {
          <div key={item.id}> {item.username}</div>
        })}
      </div>
      <button onClick={onLeaveEvent}>Leave Event</button>
    </div>
  )
}

export default Chat