import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import styles from './Navbar.module.css';

import { useMyDispatch, useMySelector } from '../../hooks/useReduxHooks';
import { logout } from '../../store/authSlice';
import { clearMessage } from '../../store/messageSlice';
import { Socket } from 'socket.io-client';

type componentProps = {
    socket: Socket | null,
};

const Navbar = ({ socket }: componentProps) => {
    const [showMessage, setShowMessage] = useState(false);

    const { loading, isAuthenticated, isAdmin, user } = useMySelector((state: any) => state.auth);
    const { eventId, event } = useMySelector((state: any) => state.event);
    const { message } = useMySelector((state: any) => state.message);
    const dispatch = useMyDispatch();
    const userId = user?.id;
    const title = event?.title;

    useEffect(() => {
        if (message) {
            setShowMessage(true);
            setTimeout(() => {
                dispatch(clearMessage());
                setShowMessage(false);
            }, 5000);
        }
    }, [message]);

    const onLogout = async () => {
        socket?.emit('leave event', userId, title );
        dispatch(logout());
    }

    return (
        <>
            {message && (
                <div className={styles.infoMessage}>
                    {message}
                </div>
            )}
            <nav className={styles.nav}>

                <a className={styles.swLink} href="https://www.streamworks.no">
                    <img src="/assets/logo_light.png" alt="logo_SW" />
                </a>
                <ul className={styles.menu}>
                    <li>
                        <NavLink
                            className={({ isActive }) => isActive ? styles.activeLink : styles.link}
                            to='/'>
                            Event Hall
                        </NavLink>
                    </li>
                    {isAuthenticated && isAdmin && (
                        <li>
                            <NavLink
                                className={({ isActive }) => isActive ? styles.activeLink : styles.link}
                                to='/admin'>
                                Admin Dashboard
                            </NavLink>
                        </li>
                    )}
                    {isAuthenticated && eventId && (
                        <li>
                            <NavLink
                                className={({ isActive }) => isActive ? styles.activeLink : styles.link}
                                to='/profile'>
                                Event Info
                            </NavLink>
                        </li>
                    )}

                    {isAuthenticated && (
                        <li>
                            <NavLink
                                className={({ isActive }) => isActive ? styles.activeLink : styles.link}
                                to='/logout'
                                onClick={onLogout}>
                                Logout
                            </NavLink>
                        </li>
                    )}




                </ul>

                <div>

                </div>
            </nav>
        </>
    );
};

export default Navbar;