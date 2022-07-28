import { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';

import styles from './Home.module.css';

import { useMySelector, useMyDispatch } from '../../hooks/useReduxHooks';
import { joinEvent, fetchEvent } from '../../store/eventSlice';
import Welcome from '../../Components/Welcome/Welcome';
import { Navigate } from 'react-router-dom';
import Chat from '../../Components/Chat/Chat';

type componentProps = {
    socket: Socket | null,
}

const Home = ({ socket }: componentProps) => {

    const dispatch = useMyDispatch();
    const { user, isAuthenticated, isAdmin } = useMySelector((state: any) => state.auth);
    const { loggedInChat, eventId, event } = useMySelector((state: any) => state.event);
    const userId = user?.id;
    const displayName = user?.displayName;

    useEffect(() => {
        const fetchEventData = async () => {
            await dispatch(fetchEvent(eventId));
            const title = event.title;
            console.log(title);
            socket?.emit('joinEvent', { displayName, title });
        }

        if (loggedInChat) {
            fetchEventData();
        } 

    }, []);

    const handleJoinEvent = (title: string) => async (event: any) => {
        console.log(title, userId);
        event.preventDefault();
        socket?.emit('joinEvent', { displayName, title });
        console.log('after emit event and user ' + displayName + ' ' + title);
        await dispatch(joinEvent({ title, userId }));
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

                    {isAuthenticated && loggedInChat && <Chat socket={socket} />}
                </div>
            </div>
        </>
    );
};


export default Home;