import { Link } from 'react-router-dom';

import styles from './IntroPage.module.css';

const IntroPage = () => {
    return (
        <div className={styles.introPageContainer}>
            <img src="/assets/hero_bkg.png" alt="" />
            <div className={styles.introTextWrapper}>
                <h1>Welcome to the StreamWorks Poll APP!</h1>
                <p><Link className={styles.altLink} to="/login">Login</Link> if you have an account</p>
                <p className={styles.or}>or</p>
                <p><Link className={styles.altLink} to="/register">Register</Link> to get an account</p>
            </div>
        </div>
    )
}

export default IntroPage;