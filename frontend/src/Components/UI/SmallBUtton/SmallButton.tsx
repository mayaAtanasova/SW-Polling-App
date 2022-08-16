import styles from './SmallButton.module.css';

type componentProps = {
    text: string,
    alertBtn?: boolean
    onClick: (ev?:any) => void,
}

const SmallButton = ({ text, onClick, alertBtn }: componentProps) => {
    return (
        <button
        className={`${styles.buttonSmall} ${alertBtn && styles.alertBtn}`}
        onClick={onClick}>
            {text}
        </button>
    )
}

export default SmallButton