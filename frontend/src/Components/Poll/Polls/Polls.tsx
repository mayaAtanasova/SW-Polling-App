import { current } from "@reduxjs/toolkit";
import { useEffect, useRef, useState } from "react";
import { IPoll } from "../../../Interfaces/IPoll";
import Poll from "../Poll/Poll";
import styles from "./Polls.module.css";

type componentProps = {
    polls: IPoll[],
}

const Polls = ({ polls }: componentProps) => {

    const [currentPollId, setCurrentPollId] = useState('');

    useEffect(() => {
        console.log(currentPollId);
    }, [currentPollId])

    const handlePollSelect = (pollId: string) => (ev: any) => {
        ev.preventDefault();
        setCurrentPollId(pollId);
    }

    return (
        <div className={styles.pollsContainer}>
            <div className={styles.pollsHeading}>
                <h4>EVENT POLLS</h4>
            </div>
            <div className={styles.pollsWrapper}>
                <div className={styles.pollsArea}>
                    {!polls && <h4>No polls are available for this event yet.</h4>}
                    {polls && 
                        <>
                            <p>Click an active poll to vote</p>

                            {polls.map((poll: any) => (
                            <Poll 
                            key={poll._id} 
                            poll={poll} 
                            onPollClicked={handlePollSelect}
                            />
                            ))}
                        </>
                    }
                </div>
            </div>
        </div>
    )
}

export default Polls;