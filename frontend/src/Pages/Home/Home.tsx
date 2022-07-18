import { useEffect, useState } from 'react';
import styles from './Home.module.css';

import { useMySelector, useMyDispatch } from '../../hooks/useReduxHooks';
import { setMessage, clearMessage } from '../../store/messageSlice';
import { joinEvent } from '../../store/eventSlice';
import Welcome from '../../Components/Welcome/Welcome';
import Chat from '../../Components/Chat/Chat';
import { Navigate } from 'react-router-dom';


const Home = () => {

    const dispatch = useMyDispatch();
    const { user, isAuthenticated, isAdmin } = useMySelector((state: any) => state.auth);
    const { loggedInChat } = useMySelector((state: any) => state.event);
    const userId = user?.id;

    const handleJoinEvent = (title: string) => (event: any) => {
        event.preventDefault();
        console.log(title, ' + ', userId);
        dispatch(joinEvent({ title, userId }));
    }

    if (!user) {
        return <Navigate to='/login' replace />
    }

    return (
        <>
            <div className={styles.heroContainer}>
                <img src="/assets/hero_bkg.png" alt="" />
            <div className={styles.homeContainer}>
                {isAuthenticated && !loggedInChat && <Welcome user={user} onJoinEvent={handleJoinEvent} />}
                {isAuthenticated && loggedInChat && < Chat />}
            </div>
            </div>
        </>
    );
};

export default Home;