
import { IPoll } from '../../../../Interfaces/IPoll';
import styles from './PollDetails.module.css';

type componentProps = {
  poll: IPoll;
  onDetailsClose: (pollId: string) => (ev: any) => void,
  // handleEditPoll: (pollId: string) => void,
}

const PollDetails = ({ poll, onDetailsClose}: componentProps) => {
  return (
    <div>PollDetails</div>
  )
}

export default PollDetails;