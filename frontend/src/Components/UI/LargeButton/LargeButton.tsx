import styles from './LargeButton.module.css';

type componentProps = {
    text: string,
    onClick: () => void,
}
const LargeButton = ({ text, onClick }: componentProps) => {
  return (
    <button
    className={styles.buttonLarge}
    onClick={onClick}>
        {text}
    </button>
  )
}

export default LargeButton;