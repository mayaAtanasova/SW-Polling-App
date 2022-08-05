

import { IPoll } from '../../../../Interfaces/IPoll';
import styles from './PollCard.module.css'

type componentProps = {
    poll: IPoll,
    onSelectPoll: (pollId: string) => (ev: any) => void,
}

const PollCard = ({ poll, onSelectPoll }: componentProps) => {
    return (
        <div>PollCard</div>
    )
}

export default PollCard;