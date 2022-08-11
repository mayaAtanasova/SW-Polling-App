import { Link } from 'react-router-dom';
import styles from './NotFound.module.css';

const NotFound = () => {
    return (
        <div className={styles.notFoundContainer}>
            <h1>4<span><img src="/assets/logo_light.png" alt="0"></img></span>4</h1>
            <h3>Ooops... Something went wrong.</h3>
            <p><Link to="/">Go back home</Link></p>
        </div>
    )
}

export default NotFound;