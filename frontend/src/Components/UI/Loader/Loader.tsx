import styles from './Loader.module.css';

const Loader = () => {
    return (
        <div className={styles.loaderWrapper}>
            <div className={styles.dotFlashing}></div>
        </div>
    )
}

export default Loader
