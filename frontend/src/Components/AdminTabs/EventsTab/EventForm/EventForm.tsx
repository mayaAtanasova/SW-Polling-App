import { FocusEventHandler, useEffect, useState } from 'react';
import clsx from 'clsx';

import { IErrors } from '../../../../Interfaces/IError';

import useDebounce from '../../../../hooks/useDebounce';
import { useLoginFormValidator } from '../../../../hooks/useLoginFormValidators';
import { useMySelector } from '../../../../hooks/useReduxHooks';
import eventsService from '../../../../services/eventService';

import styles from './EventForm.module.css';

type formProps = {
    hideEventForm: (ev?: any) => void,
}
const EventForm = ({ hideEventForm }: formProps) => {

    const [loading, setLoading] = useState(false);
    const { user } = useMySelector(state => state.auth);
    const userId = user?.id;

    const [form, setForm] = useState({
        eventTitle: '',
        description: '',
    });
    const debouncedFormValue = useDebounce(form, 500);
    const [formValid, setFormValid] = useState(false);

    const {
        errors,
        validateForm,
        onBlurField,
    }: {
        errors: IErrors,
        validateForm: Function,
        onBlurField: FocusEventHandler,
    } = useLoginFormValidator(form);

    useEffect(() => {
        const { isFormValid } = validateForm({
            form,
            errors,
        });
        setFormValid(isFormValid);
    }, []);

    const onUpdateField = (e: any) => {
        const field = e.target.name;
        const value = e.target.value;
        const nextFormState = {
            ...form,
            [field]: value,
        };
        errors[field].dirty = true;
        setForm(nextFormState);
    }

    useEffect(() => {
        onValidateField();
    }, [debouncedFormValue]);

    const onValidateField = () => {
        const { isFormValid } =
            validateForm({
                form,
                errors,
            });
        setFormValid(isFormValid);
    };

    const onSubmitForm = (e: any) => {
        e.preventDefault();

        const { isFormValid } =
            validateForm({
                form,
                errors,
            });
        setFormValid(isFormValid);

        setLoading(true);
        if(userId){
            const formData = {
                title: form.eventTitle.toLowerCase(),
                description: form.description,
                userId,
            }
            eventsService
            .createEvent(formData)
            .then((data) => {
                if (data) {
                    console.log(data);
                    setLoading(false);
                    hideEventForm();
                }
            })
            .catch(err => {
                console.log(err);
                setLoading(false);
            });

        }
        hideEventForm();
        setLoading(false);

    };

    return (
        <>
            <div className={styles.formTitle}>
                <h2>Create event</h2>
                <p>Choose a title and description for your event, then click <b>"Create event"</b> to publish it.</p>
            </div>
            <form
                className={styles.form}
                onSubmit={onSubmitForm}
            >

                <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Title</label>
                    <input
                        className={clsx(
                            styles.formField,
                            errors.eventTitle.dirty && errors.eventTitle.error && styles.formFieldError,
                        )}
                        type="text"
                        aria-label='Title field'
                        name='eventTitle'
                        placeholder="E.g Our company event"
                        value={form.eventTitle}
                        onChange={onUpdateField}
                        onBlur={onBlurField}
                    />
                    {errors.eventTitle.dirty && errors.eventTitle.error
                        ? (<p className={styles.formFieldErrorMessage}>{errors.eventTitle.message}</p>)
                        : null}
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Description</label>
                    <div className={styles.inputGroup}>
                        <textarea
                            className={clsx(
                                styles.formTextField,
                                errors.description.dirty &&
                                errors.description.error &&
                                styles.formFieldError
                            )}
                            aria-label='Description field'
                            name='description'
                            rows={4}
                            cols={60}
                            placeholder="E.g. A catchy description"
                            value={form.description}
                            onChange={onUpdateField}
                            onBlur={onBlurField}
                        ></textarea>
                    </div>
                    {errors.description.dirty && errors.description.error
                        ? (<p className={styles.formFieldErrorMessage}>{errors.description.message}</p>)
                        : null}
                </div>

                <div className={styles.formActions}>
                    <button
                        className={styles.formSubmitBtn}
                        type="submit"
                        disabled={!formValid || loading}
                    >
                        {!loading && <p>Create event</p>}
                        {loading && <p>...Loading</p>}
                    </button>
                    <button
                        className={styles.formCancelBtn}
                        onClick={hideEventForm}
                    >
                        Cancel
                    </button>
                </div>

            </form>
        </>
    )
}

export default EventForm;