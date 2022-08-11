import { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';

import styles from './Home.module.css';

import { useMySelector, useMyDispatch } from '../../hooks/useReduxHooks';
import { joinEvent, fetchEvent, fetchMessages, fetchPolls } from '../../store/eventSlice';
import Welcome from '../../Components/Welcome/Welcome';
import { Navigate } from 'react-router-dom';
import Messages from '../../Components/Chat/Messages';
import { RootState } from '../../store/store';
import { IMessage } from '../../Interfaces/IMessage';
import messageService from '../../services/messageService';
import MessageInput from '../../Components/Chat/MessageInput';
import Polls from '../../Components/Poll/Polls/Polls';
import ConfirmDialog from '../../Components/Shared/ConfirmDialog/ConfirmDialog';


type componentProps = {
    socket: Socket | null,
};

const Home = ({ socket }: componentProps) => {

    const { user, isAuthenticated } = useMySelector((state: RootState) => state.auth);
    const { loading, loggedInChat, eventId, event } = useMySelector((state: RootState) => state.event);
    const userId = user?.id;
    const title = event?.title;
    const messages = event?.messages;
    const polls = event?.polls;
    const displayName = user?.displayName;

    const dispatch = useMyDispatch();

    const [idToDetele, setIdToDelete] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        if (!socket) return;
        socket.on('fetch messages', (title: string) => fetchEventMessages(title));
        socket.on('fetch event data', fetchEventData);
        socket.on('fetch polls', (title: string) => fetchEventPolls(title));

        if (loggedInChat && !title) {
            const title = localStorage.getItem('eventTitle');
            socket.emit('join event', { userId, displayName, title });
        }
    }, []);

    const fetchEventData = () => {
        console.log('fetching event data');
        dispatch(fetchEvent(eventId!));
    }

    const fetchEventMessages = (title: string) => {
        console.log('rcvd order to fetch messages');
        dispatch(fetchMessages(eventId!));
    }

    const fetchEventPolls = (eventTitle: string) => {
        console.log('rcvd order to fetch polls');
        console.log(eventTitle, title);
        dispatch(fetchPolls(eventId!));
    }

    const handleJoinEvent = (title: string) => async (event: any) => {
        event.preventDefault();
        event.stopPropagation();
        if (userId) {
            await dispatch(joinEvent({ title, userId }));
            socket?.emit('join event', { userId, displayName, title });
        }
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
        const sentMessage = await messageService.sendMessage(newMessage);
        socket?.emit('chat message', userId, title);
    }

    const handleDeleteMessagePressed = (messageId: string) => {
        if (!userId) return;
        setIdToDelete(messageId);
        setIsDialogOpen(true);
    }

    const onDialogClose = async (answer: boolean) => {
        if (answer) {
            console.log('should delete message ' + idToDetele);
            const result = await messageService.deleteMessage(idToDetele, eventId!);
            console.log(result);
            if (result?.success){
                socket?.emit('chat message', userId, title)
            }
        } else {
            setIdToDelete('');
        }
        setIsDialogOpen(false);
    }

    const handleAnswerMessage = async (messageId: string) => {
        console.log(messageId);
        if (!userId) return;
        const result = await messageService.answerMessage(messageId);
        if (result?.success) {
            socket?.emit('chat message', userId, title)
        }
    }

    const userVoted = (pollId: string) => {
        socket?.emit("user vote", userId, title, pollId);
        dispatch(fetchPolls(eventId!));
    }

    if (!user) {
        return <Navigate to='/login' replace />
    }

    return (
        <div className={styles.homeContainer}>
            <img src="/assets/hero_bkg.png" alt="" />

            {isAuthenticated && !loggedInChat &&
                <Welcome
                    user={user}
                    isAuthenticated={isAuthenticated}
                    onJoinEvent={handleJoinEvent}
                />}

            <div className={styles.homeContainer}>
                {isAuthenticated && loggedInChat && messages &&
                    <div className={styles.chatArea}>
                        <Messages 
                        messages={messages} 
                        onDeleteButtonPressed={handleDeleteMessagePressed}
                        onAnswerButtonPressed={handleAnswerMessage} 
                        />
                        <MessageInput onChatMessage={sendChatMessage} />
                    </div>
                }

                {isAuthenticated && loggedInChat &&
                    <div className={styles.pollsArea}>
                        <Polls polls={polls}
                            onVoteComplete={userVoted} />
                    </div>}
            </div>

            {isDialogOpen && <ConfirmDialog itemType='message' onDialogClose={onDialogClose} />}
        </div>
    );
};


export default Home;