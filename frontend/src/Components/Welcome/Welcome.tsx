import React, { useState } from 'react'
import styles from './Welcome.module.css'

const Welcome = (props: any) => {

    const [title, setTitle] = useState('');

    const onTitleChange = (e: any) => {
        setTitle(e.target.value);
    }

    return (
        <>
            <div className={styles.welcomeText}>

                <h1 className={styles.title}>Welcome to the StreamWorks Poll App</h1>
                {!props.isAuthenticated && <p>Please log in to start using it</p>}
                {props.isAuthenticated &&
                    <>
                        <p>You are logged in as <span>{props.user.displayName}</span></p>
                        <p>Please enter your event title to proceed:</p>

                        <form className={styles.joinForm} onSubmit={props.onJoinEvent(title)}>
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