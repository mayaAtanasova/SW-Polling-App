import { useEffect } from "react";
import { useMySelector, useMyDispatch } from "../../hooks/useReduxHooks";
import { leaveEvent } from "../../store/eventSlice";

import styles from "./Chat.module.css";

const Chat = () => {

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
    console.log("Chat component mounted " + event.title);
  }, []);
  const onLeaveEvent = () => {
    console.log('leaving event');
    dispatch(leaveEvent({eventId, userId}));
  }

  if(!event.title) {
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
      <div>
        { messages.map((message: any) => {
          <p>{message.text}</p> 
        })
      }
      </div>
      <button onClick={onLeaveEvent}>Leave Event</button>
    </div>
  )
}

export default Chat