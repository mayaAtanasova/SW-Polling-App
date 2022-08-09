import { useState } from 'react'

import styles from './ConfirmDialog.module.css'

type componentProps = {
    onDialogClose: (answer: boolean) => void,
    itemType: string,
}

const ConfirmDialog = ({ itemType, onDialogClose }: componentProps) => {
    return (
        <div className={styles.dialogBkg}>
            <div className={styles.dialogBody}>
                <h2>Are you sure you want to delete this {itemType}?</h2>
                <div className={styles.dialogButtons}>
                    <button className={styles.cancelButton} onClick={() => onDialogClose(false)}>Cancel</button>
                    <button className={styles.confirmButton} onClick={() => onDialogClose(true)}>Confirm</button>
                </div>
            </div>
        </div>
    )
}

export default ConfirmDialog;