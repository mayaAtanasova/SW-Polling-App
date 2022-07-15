import styles from './Home.module.css';
import { useMySelector } from '../../hooks/useReduxHooks';

const Home = () => {

    const { user, isAuthenticated, isAdmin } = useMySelector((state: any) => state.auth);
    return (
        <div>
            <div className={styles.heroContainer}>
                <img src="/assets/hero_bkg.png" alt="" />
            </div>
            <div className={styles.homeText}>
                <h1 className={styles.title}>Welcome to the StreamWorks Poll App</h1>
                {!isAuthenticated && <p>Please log in to start using it</p>}
                {isAuthenticated && 
                <>
                <p>You are logged in as <span>{user.displayName}</span></p>
                <p>Please enter your organization id to proceed:</p>
                <input className={styles.formField} type="text" />
                </>}
            </div>
        </div>
    );
};

export default Home;