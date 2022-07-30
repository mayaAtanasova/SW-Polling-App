import LargeButton from '../../UI/LargeButton/LargeButton';

import styles from './PollsTab.module.css';

const PollsTab = () => {
  return (
    <div className={styles.pollsWrapper}>
      <LargeButton
        text="create new poll"
        onClick={() => console.log('create poll')}
      />
    </div>
  )
}

export default PollsTab;