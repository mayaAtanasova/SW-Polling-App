import { useEffect } from 'react';
import { Socket } from 'socket.io-client';

import styles from './Home.module.css';

import { useMySelector, useMyDispatch } from '../../hooks/useReduxHooks';
import { joinEvent, fetchEvent, fetchMessages } from '../../store/eventSlice';
import Welcome from '../../Components/Welcome/Welcome';
import { Navigate } from 'react-router-dom';
import Messages from '../../Components/Chat/Messages';
import IRootState from '../../Interfaces/IRootState';
import { IMessage } from '../../Interfaces/IMessage';
import messageService from '../../services/messageService';
import MessageInput from '../../Components/Chat/MessageInput';


type componentProps = {
    socket: Socket | null,
};

const Home = ({ socket }: componentProps) => {

    const dispatch = useMyDispatch();
    const { user, isAuthenticated, isAdmin } = useMySelector((state: IRootState) => state.auth);
    const { loading, loggedInChat, eventId, event } = useMySelector((state: IRootState) => state.event);
    const userId = user?.id;
    const displayName = user?.displayName;
    const title = event?.title;
    const messages = event?.messages;

    useEffect(() => {
        if (!socket) return;
        socket.emit('new user', userId, displayName);
        socket.on('fetch messages', (title: string) => fetchEventMessages(title));
        socket.on('fetch event data', fetchEventData);

        if (loggedInChat && !title) {
            const title = localStorage.getItem('eventTitle');
            socket.emit('joinEvent', { userId, displayName, title });
        }
    }, [socket]);

    const fetchEventData = () => {
        console.log('fetching event data');
        dispatch(fetchEvent(eventId!));
    }

    const fetchEventMessages = (title: string) => {
        console.log('rcvd order to fetch messages');
        dispatch(fetchMessages(title));
    }

    const handleJoinEvent = (title: string) => async (event: any) => {
        console.log(title, userId);
        event.preventDefault();
        if (userId) {
            await dispatch(joinEvent({ title, userId }));
        }
        socket?.emit('joinEvent', { userId, displayName, title });
        console.log('after emit event and user ' + displayName + ' ' + title);
    }

    const sendChatMessage = (message: string) => async (ev: any) => {
        ev.preventDefault();
        ev.target.reset();
        if (!user || !event || message === '') return;
        const newMessage: IMessage = {
            evid: eventId!,
            text: message,
            userId: userId!,
            username: user.displayName!,
            date: new Date().toISOString(),
        }
        console.log('new message: ' + newMessage.text);
        await messageService.sendMessage(newMessage);
        socket?.emit("chat message", userId, title);
    }

    if (!user) {
        return <Navigate to='/login' replace />
    }

    return (
        <>
            <div className={styles.heroContainer}>
                <img src="/assets/hero_bkg.png" alt="" />
                <div className={styles.homeContainer}>

                    {isAuthenticated && !loggedInChat &&
                        <Welcome
                            user={user}
                            isAuthenticated={isAuthenticated}
                            onJoinEvent={handleJoinEvent}
                        />}

                    {isAuthenticated && loggedInChat && messages &&
                        <div className={styles.chatArea}>
                            <Messages messages={messages} />
                            <MessageInput onChatMessage={sendChatMessage} />
                        </div>
                    }
                </div>
            </div>
        </>
    );
};


export default Home;