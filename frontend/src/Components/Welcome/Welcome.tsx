import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { IUser, IUserCompact } from '../../Interfaces/IUser'
import styles from './Welcome.module.css'

type welcomeComponentProps = {
    user: IUserCompact,
    isAuthenticated: boolean,
    onJoinEvent: (title: string) => (event: any) => void,
}

const Welcome = ({ user, isAuthenticated, onJoinEvent }: welcomeComponentProps) => {

    const [title, setTitle] = useState('');

    const onTitleChange = (e: any) => {
        setTitle(e.target.value);
    }

    return (
        <>
            <div className={styles.welcomeText}>

                <h1 className={styles.title}>Welcome to the StreamWorks Poll App</h1>
                {isAuthenticated &&
                    <>
                        <p>You are logged in as <span>{user.displayName}</span></p>
                        <p>Please enter your event title to proceed:</p>

                        <form
                            className={styles.joinForm}
                            onSubmit={onJoinEvent(title)}
                        >
                            <input
                                className={styles.formField}
                                type="text"
                                value={title}
                                onChange={onTitleChange}
                            />
                            <button type="submit" className={styles.formSubmitBtn}>Join Event</button>
                        </form>
                    </>}
            </div>
        </>
    )
}

export default Welcome