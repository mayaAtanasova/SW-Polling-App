
import { useEffect, useState } from 'react';
import { IPoll } from '../../../Interfaces/IPoll';

import styles from './PollDetails.module.css';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faCross, fas, faX } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
library.add(fas, far);


type componentProps = {
    poll: IPoll,
    onPollClose: () => void,
    onVote: (option: string) => (ev:any) => void,
}
const PollDetails = ({ poll, onPollClose, onVote }: componentProps) => {

    const [answer, setAnswer,] = useState('');
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const polType = poll.type;

    useEffect(() => {
        console.log(answer);
    }, [answer])

    const MCList = (options?: string[]) => {

        const selectOption = (option:string, id:number) => {
            setAnswer(option);
            setSelectedId(id);
        }

        if (options) {
            return (
            <div className={styles.mcOptionsWrapper}>
            { options.map((option: string, id:number) =>
                <div
                    key={id}
                    className={`${styles.pollOptionItem} ${selectedId === id ? styles.selected : ''}`}
                    onClick={(ev) => selectOption(option, id)}
                >
                    <p>{option}</p>
                </div>
            ) }
            </div>
            )
        }
        return <div>No options provided</div>
    }

    const OAItem = () => {
        return (
            <div className={styles.oaInputWrapper}>
                <input type="text" name="oaInput" onChange={(ev) => setAnswer(ev.target.value)}/>
            </div>
        )
    }

    const ratingArray = Array(5).fill(1);

    const RatingList = () => {
        const [rating, setRating] = useState(1);

        const getRating = (id: number) => (ev: any) => {
            const curRating = id + 1;
            const curAnswer = curRating.toString();
            setRating(curRating);
            setAnswer(curAnswer);
        }

        return (
            <div className={styles.ratingList}>
                {ratingArray.map((item: any, id: number) =>
                (<div key={id} onClick={getRating(id)}>
                    <FontAwesomeIcon icon={id<=rating-1 ? ['fas', 'star'] : ['far', 'star']}></FontAwesomeIcon>
                </div>)
                )}
            </div>
        )
    }

    const pollsByType: {
        [key: string]: (options?: string[]) => JSX.Element | JSX.Element[],
    } = {
        'multiple choice': MCList,
        'open answer': OAItem,
        'rating': RatingList,
    }

    const answerElement = pollsByType[polType];

    const onClose = (ev: any) => {
        ev.preventDefault();
        setAnswer('');
        onPollClose();
    }

    return (
        <div className={styles.pollDetailsContainer}>
            <div className={styles.pollDetailsWrapper}>
                <h4>{poll.title}</h4>
                {answerElement(poll.options)}
                <button className={styles.voteButton} onClick={onVote(answer)}>Vote</button>
                <button className={styles.closeButton} onClick={onClose}><FontAwesomeIcon icon={faX}/></button>
            </div>
        </div>
    )
}

export default PollDetails;