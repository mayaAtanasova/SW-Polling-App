import clsx from 'clsx';
import { FocusEventHandler, useEffect, useState } from 'react';
import useDebounce from '../../../hooks/useDebounce';
import { useLoginFormValidator } from '../../../hooks/useLoginFormValidators';
import { IErrors } from '../../../Interfaces/IError';
import styles from './EventForm.module.css';


type formProps = {
    hideEventForm: (ev?:any) => void,
}
const EventForm = ({ hideEventForm }: formProps) => {

    const [loading, setLoading ] = useState(false);

    const [form, setForm] = useState({
        title: '',
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

        console.log(form);
        hideEventForm();

    };

    return (
        <form
            className={styles.form}
            onSubmit={onSubmitForm}
        >
            <div className={styles.formTitle}>
                <h1>Choose a title and description for your event</h1>
            </div>
            <div className={styles.formGroup}>
                <label className={styles.formLabel}>Title</label>
                <input
                    className={clsx(
                        styles.formField,
                        errors.title.dirty && errors.title.error && styles.formFieldError,
                    )}
                    type="text"
                    aria-label='Title field'
                    name='title'
                    placeholder="E.g Our company event"
                    value={form.title}
                    onChange={onUpdateField}
                    onBlur={onBlurField}
                />
                {errors.title.dirty && errors.title.error
                    ? (<p className={styles.formFieldErrorMessage}>{errors.title.message}</p>)
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
            </div>

        </form>
    )
}

export default EventForm;