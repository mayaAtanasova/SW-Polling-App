import { FocusEventHandler, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { TokenResponse, useGoogleLogin } from '@react-oauth/google'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import clsx from 'clsx';
import styles from './Login.module.css';

import { useMyDispatch, useMySelector } from '../../hooks/useReduxHooks';
import { login, googleLogin } from '../../store/authSlice';
import { setMessage, clearMessage } from '../../store/messageSlice';
import { useLoginFormValidator } from '../../hooks/useLoginFormValidators';
import useDebounce from '../../hooks/useDebounce';

import { IErrors } from '../../Interfaces/IError';

const LoginForm = () => {

    const [form, setForm] = useState({
        email: '',
        password: '',
    });
    const debouncedFormValue = useDebounce(form, 500);
    const [showPass, setShowPass] = useState(false);
    const [formValid, setFormValid] = useState(false);

    const { loading, isAuthenticated, isAdmin } = useMySelector((state: any) => state.auth);
    const { message } = useMySelector((state: any) => state.message);
    const dispatch = useMyDispatch();

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
        dispatch(clearMessage());
    }, [dispatch]);

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

    const revealPass = (event: React.MouseEvent) => {
        event.preventDefault();
        setShowPass(showPass => !showPass);
    }

    const onSubmitForm = (e: any) => {
        e.preventDefault();

        const { isFormValid } =
            validateForm({
                form,
                errors,
            });
        setFormValid(isFormValid);

        dispatch(login(form))
            .unwrap()
            .then((value: any) => {
                console.log(value);
            })
            .catch((error: any) => {
                console.log(error);
            })

    };

    const googleAuth = useGoogleLogin({
        onSuccess: (response: TokenResponse) => {
            dispatch(googleLogin(response))
        },
        onError: (error: any) => {
            console.log(error);
            dispatch(setMessage('Unsuccessful authorization, please try again.'));
        }
    })

    if (isAuthenticated) {
        if (isAdmin) {
            return <Navigate to="/admin" />
        }
        return <Navigate to="/" replace />
    }

    return (
        <form
            className={styles.form}
            onSubmit={onSubmitForm}
        >
            <div className={styles.formTitle}>
                <h1>Log into the SW PollApp</h1>
            </div>
            <div className={styles.formGroup}>
                <label className={styles.formLabel}>Email</label>
                <input
                    className={clsx(
                        styles.formField,
                        errors.email.dirty && errors.email.error && styles.formFieldError,
                    )}
                    type="text"
                    aria-label='Email field'
                    name='email'
                    placeholder="john.doe@my.com"
                    value={form.email}
                    onChange={onUpdateField}
                    onBlur={onBlurField}
                />
                {errors.email.dirty && errors.email.error ? (
                    <p className={styles.formFieldErrorMessage}>{errors.email.message}</p>
                ) : null}
            </div>

            <div className={styles.formGroup}>
                <label className={styles.formLabel}>Password</label>
                <div className={styles.inputGroup}>
                    <input
                        className={clsx(
                            styles.formField,
                            errors.password.dirty &&
                            errors.password.error &&
                            styles.formFieldError
                        )}
                        type={showPass ? 'text' : 'password'}
                        aria-label='Password field'
                        name='password'
                        placeholder="********"
                        value={form.password}
                        onChange={onUpdateField}
                        onBlur={onBlurField}
                    />
                    <div className={styles.faIcon} onClick={revealPass}>
                        <FontAwesomeIcon icon={showPass ? faEyeSlash : faEye} />
                    </div>
                </div>
                {errors.password.dirty && errors.password.error ? (
                    <p className={styles.formFieldErrorMessage}>{errors.password.message}</p>
                ) : null}
            </div>

            <div className={styles.formActions}>
                <button
                    className={styles.formSubmitBtn}
                    type="submit"
                    disabled={!formValid || loading}
                >
                    {!loading && <p>Login</p>}
                    {loading && <p>...Loading</p>}
                </button>
                <p className={styles.or}>or</p>
                <button
                    className={styles.googleBtn}
                    type="button"
                    onClick={() => googleAuth()}
                >
                    <span>
                        <img src="/assets/google-logo.png" alt="Google_logo" />
                    </span>
                    Proceed with Google
                </button>
            </div>


        </form>
    );
};

export default LoginForm;