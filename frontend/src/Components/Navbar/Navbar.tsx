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
    const { eventId } = useMySelector((state: any) => state.event);
    const { message } = useMySelector((state: any) => state.message);
    const dispatch = useMyDispatch();
    const userId = user?.id;

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
        dispatch(logout());
        socket?.disconnect();
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
                    {!isAuthenticated && (
                        <>
                            <li>
                                <NavLink
                                    className={({ isActive }) => isActive ? styles.activeLink : styles.link}
                                    to='/login' >
                                    Login
                                </NavLink>
                            </li>

                            <li>
                                <NavLink
                                    className={({ isActive }) => isActive ? styles.activeLink : styles.link}
                                    to='/register'>
                                    Register
                                </NavLink>
                            </li>
                        </>
                    )}
                    {isAdmin && (

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
                                Event Details
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