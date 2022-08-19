import { useContext, useEffect, useState } from 'react';
import { SocketContext } from '../../store/socketContext';

import styles from './Home.module.css';

import { useMySelector, useMyDispatch } from '../../hooks/useReduxHooks';
import { joinEvent, fetchEvent, fetchMessages, fetchPolls, setPollsStatus, setChatStatus } from '../../store/eventSlice';
import Welcome from '../../Components/Welcome/Welcome';
import { Navigate } from 'react-router-dom';
import Messages from '../../Components/Chat/Messages';
import { RootState } from '../../store/store';
import { IMessage } from '../../Interfaces/IMessage';
import messageService from '../../services/messageService';
import MessageInput from '../../Components/Chat/MessageInput';
import Polls from '../../Components/Poll/Polls/Polls';
import ConfirmDialog from '../../Components/Shared/ConfirmDialog/ConfirmDialog';

const Home = () => {

    const socket = useContext(SocketContext);
    const { user, isAuthenticated } = useMySelector((state: RootState) => state.auth);
    const { loading, loggedInChat, eventId, event } = useMySelector((state: RootState) => state.event);
    const userId = user?.id;
    const eventTitle = event?.title;
    const messages = event?.messages;
    const polls = event?.polls;
    const displayName = user?.displayName;

    const dispatch = useMyDispatch();

    const [idToDetele, setIdToDelete] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const [isChatHidden, setIsChatHidden] = useState(event.chatHidden);
    const [isPollsHidden, setIsPollsHidden] = useState(event.pollsHidden);

    useEffect(() => {
        console.log('chat area is closed? ', isChatHidden);
        console.log('polls area is closed? ', isPollsHidden);
    }, [isChatHidden, isPollsHidden]);

    useEffect(() => {
        if (!socket) return;
        socket.on('fetch messages', (title: string) => fetchEventMessages(title));
        socket.on('fetch event data', fetchEventData);
        socket.on('fetch polls', (title: string) => fetchEventPolls(title));
        socket.on('should toggle polls', (title: string) => togglePolls(title));
        socket.on('should toggle chat', (title: string) => toggleChat(title));

        if (loggedInChat && !eventTitle) {
            const title = localStorage.getItem('eventTitle');
            socket.emit('join event', { userId, displayName, title });
        }

        return () => {
            socket.off('fetch messages');
            socket.off('fetch event data');
            socket.off('fetch polls');
            socket.off('should toggle polls');
            socket.off('should toggle chat');
        }
    }, [socket]);

    useEffect(() => {
        console.log(eventId);
        if (!loading && eventId) {
            const title = localStorage.getItem('eventTitle');
            socket?.emit('join event', { userId, displayName, title });
            fetchEventData();
            console.log('after emit event and user ' + displayName + ' ' + title);
        }
    }, [eventId]);

    const fetchEventData = () => {
        console.log('fetching event data');
        if (eventId) {
            dispatch(fetchEvent(eventId!));
        }
    }

    const togglePolls = (title: string) => {
        console.log('rcvd order to toggle polls');
        if (title === eventTitle) {
            setIsPollsHidden(status => !status);
            dispatch(setPollsStatus(isPollsHidden));
        }
    }

    const toggleChat = (title: string) => {
        console.log('rcvd order to toggle chat');
        if (title === eventTitle) {
            setIsChatHidden(status => !status);
            dispatch(setChatStatus(isChatHidden));
        }
    }

    //Look into this scenario!
    const fetchEventMessages = (title: string) => {
        console.log('rcvd order to fetch messages');
        const evid = localStorage.getItem('eventId');
        if (evid) {
            console.log(evid);
            dispatch(fetchMessages(evid));
        }
    }

    const fetchEventPolls = (eventTitle: string) => {
        console.log('rcvd order to fetch polls');
        console.log(eventTitle, eventTitle);
        console.log(eventId);
        dispatch(fetchPolls(eventId!));
    }

    const handleJoinEvent = (title: string) => async (event: any) => {
        event.preventDefault();
        event.stopPropagation();
        if (title === '') return;
        if (userId) {
            title = title.toLowerCase();
            dispatch(joinEvent({ title, userId }));
        }
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
        console.log('sent message ' + sentMessage);
        socket?.emit('chat message', userId, eventTitle);
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
            if (result?.success) {
                socket?.emit('chat message', userId, eventTitle)
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
            socket?.emit('chat message', userId, eventTitle)
        }
    }

    const userVoted = (pollId: string) => {
        socket?.emit("user vote", userId, eventTitle, pollId);
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
                {isAuthenticated && loggedInChat && !isChatHidden &&
                    <div className={styles.chatArea}>
                        <Messages
                            messages={messages}
                            onDeleteButtonPressed={handleDeleteMessagePressed}
                            onAnswerButtonPressed={handleAnswerMessage}
                        />
                        <MessageInput onChatMessage={sendChatMessage} />
                    </div>
                }

                {isAuthenticated && loggedInChat && !isPollsHidden &&
                    <div className={styles.pollsArea}>
                        <Polls polls={polls}
                            onVoteComplete={userVoted} />
                    </div>}
            </div>

            {isDialogOpen && <ConfirmDialog itemType='message' actionType="delete" onDialogClose={onDialogClose} />}
        </div>
    );
};


export default Home;