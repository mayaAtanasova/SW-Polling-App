import { genColor } from '../../../helpers/colorGenerator';

import styles from './Avatar.module.css';

type componentProps = {
    displayName: string,
}

const Avatar = ({ displayName }: componentProps) => {
    return (
        <div
            className={styles.profileLogo}
            style={{ 'backgroundColor': genColor() }}
        >
            {displayName.split(' ').map((name: any) => name[0].toUpperCase()).join('')}
        </div>
    )
}

export default Avatar;