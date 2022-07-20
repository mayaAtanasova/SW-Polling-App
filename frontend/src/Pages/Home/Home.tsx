import { useEffect, useState } from 'react';
import socketIoClient, { Socket } from 'socket.io-client';

import styles from './Home.module.css';

import { useMySelector, useMyDispatch } from '../../hooks/useReduxHooks';
import { joinEvent, fetchEvent } from '../../store/eventSlice';
import Welcome from '../../Components/Welcome/Welcome';
import { Navigate } from 'react-router-dom';
import Chat from '../../Components/Chat/Chat';


const Home = () => {

    const [socket, setSocket] = useState<Socket | null>(null);

    const dispatch = useMyDispatch();
    const { user, isAuthenticated, isAdmin } = useMySelector((state: any) => state.auth);
    const { loggedInChat, eventId } = useMySelector((state: any) => state.event);
    const userId = user?.id;
    const displayName = user?.displayName;

    useEffect(() => {
        if (loggedInChat) {
            dispatch(fetchEvent(eventId));
        }
    }, []);

    useEffect(() => {
        const socket = socketIoClient(process.env.REACT_APP_MAIN_URL!);
        setSocket(socket);
    }, []);

    const handleJoinEvent = (title: string) => (event: any) => {
        console.log(title, userId);
        event.preventDefault();
        dispatch(joinEvent({ title, userId }));
        // dispatch(fetchEvent(eventId));
        socket?.emit('joinEvent', { displayName, title });
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

                    {isAuthenticated && loggedInChat && <Chat />}
                </div>
            </div>
        </>
    );
};

export default Home;