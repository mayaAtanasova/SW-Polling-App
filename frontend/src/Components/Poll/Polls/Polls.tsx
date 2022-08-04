import { useEffect, useState } from "react";
import { useMySelector, useMyDispatch } from "../../../hooks/useReduxHooks";
import { setVote } from "../../../store/eventSlice";
import { IPoll } from "../../../Interfaces/IPoll";
import Poll from '../PollItem/PollItem';
import pollsService from '../../../services/pollsService';
import PollDetails from "../PollDetails/PollDetails";

import styles from "./Polls.module.css";
import { Socket } from "socket.io-client";

type componentProps = {
    polls: IPoll[],
    onVoteComplete: (pollId: string) => void,
}

const Polls = ({ polls }: componentProps) => {

    const [currentPollId, setCurrentPollId] = useState('');
    const [selectedPoll, setSelectedPoll] = useState<IPoll | null>(null);
    const { user } = useMySelector(state => state.auth);
    const userId = user?.id;

    const dispatch = useMyDispatch();

    //set the poll to be desplayed in detail view
    useEffect(() => {
        console.log(currentPollId);
        if(currentPollId !== '') {
        pollsService.getPollbyId(currentPollId)
        .then(poll => {
            setSelectedPoll(poll);
        })
        .catch((err) => {
            console.log(err);
        });
    }
    }, [currentPollId])

    //open detailed view of selected poll
    const handlePollSelect = (pollId: string) => (ev: any) => {
        ev.preventDefault();
        setCurrentPollId(pollId);
    }

    //close detailed view of selected poll
    const onPollClose = () => {
        setSelectedPoll(null);
        setCurrentPollId('');
    }

    //vote in selected poll
    const onVote = (option: string) => (ev:any) => {
        console.log(currentPollId, userId, option);
        pollsService.voteInPoll(currentPollId, userId, option)
        .then(() => {
            const castVote = {currentPollId, userId, option};
            dispatch(setVote(castVote));
        })
        .catch((err) => {
            console.log(err);
        })
        .finally(() => {
            setSelectedPoll(null);
            setCurrentPollId('');
        })
    }

    return (
        <>
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
{selectedPoll && <PollDetails poll={selectedPoll} onVote={onVote}  onPollClose={onPollClose}/>}
        </>
    )
}

export default Polls;