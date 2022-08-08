import { faMinusCircle, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from 'clsx';
import React, { FocusEventHandler, useEffect } from 'react';
import { IErrors } from '../../../../Interfaces/IError';

import styles from './PollForm.module.css';

type componentProps = {
    name: string,
    index: number,
    value: string,
    onUpdateField: (e: any) => void,
    onBlurField: FocusEventHandler,
    onMcOptionAdd: (ev: any) => void,
    onMcOptionRemove: (index: number) => (ev: any) => void,
}

const PollOptionInput = ({
    name,
    index,
    value,
    onUpdateField,
    onBlurField,
    onMcOptionAdd,
    onMcOptionRemove }: componentProps) => {

    // useEffect(() => {
    //     console.log(name);
    // }, [])
    const [option, setOption] = React.useState('');
    return (
        <div className={styles.formOptionGroup}>

            <button
                type="button"
                onClick={onMcOptionRemove(index)}
                className={styles.inputARButton}
            >
                <FontAwesomeIcon icon={ faMinusCircle }/>
            </button>

            <div className={styles.formGroup}>

                <label className={styles.formLabel}>Type an option</label>
                <input
                    // className={clsx(
                    //     styles.formField,
                    //     errors[name].dirty && errors[name].error && styles.formFieldError,
                    // )}
                    type="text"
                    aria-label='Option field'
                    name={name}
                    value={value}
                    onChange={onUpdateField}
                    onBlur={onBlurField}
                />
                {/* {errors.option.dirty && errors.option.error
                ? (<p className={styles.formFieldErrorMessage}>{errors[name].message}</p>)
                : null} */}
            </div>

            <button 
            type="button" 
            onClick={ onMcOptionAdd }
            className={styles.inputARButton}
            >
                <FontAwesomeIcon icon={faPlusCircle}/>
            </button>


        </div>
    )
}

export default PollOptionInput