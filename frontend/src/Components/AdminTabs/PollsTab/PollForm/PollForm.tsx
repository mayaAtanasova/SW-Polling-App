import { FocusEventHandler, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { idGenerator } from '../../../../helpers/idGenerator';
import useDebounce from '../../../../hooks/useDebounce';
import { useLoginFormValidator } from '../../../../hooks/useLoginFormValidators';
import { useMySelector } from '../../../../hooks/useReduxHooks';
import { IErrors } from '../../../../Interfaces/IError';
import { IPollCompact } from '../../../../Interfaces/IPoll';
import PollOptionInput from './PollOptionInput';

import styles from './PollForm.module.css';
import { IEventCompact } from '../../../../Interfaces/IEvent';
import pollsService from '../../../../services/pollsService';
import { Socket } from 'socket.io-client';
import { ScriptElementKindModifier } from 'typescript';

type formProps = {
  mode: 'create' | 'edit' | 'duplicate';
  poll?: IPollCompact;
  events: IEventCompact[];
  hidePollForm: (successfulPublish: boolean, eventId: string) => void,
}

type Option = {
  id: string,
  value: string,
}

type Form = { [key: string]: string }

const pollTypes = {
  mc: 'multiple choice',
  oa: 'open answer',
  rating: 'rating',
}

const PollForm = ({ mode, poll, events, hidePollForm }: formProps) => {

  const pollTitleRef = useRef<HTMLInputElement | null>(null);

  const [options, setOptions] = useState<Option[]>(poll?.options.map((option) => ({ id: idGenerator(), value: option })) || []);
  const initialFormOptions = options.reduce((acc, option) => ({ ...acc, [`option${option.id}`]: option.value }), {});
  
  const initialFormState = {
    create: {
      title: '',
    },
    edit: {
      title: poll?.title || '',
      ...initialFormOptions,
    },
    duplicate: {
      title: poll?.title + '-copy',
      ...initialFormOptions,
    }
  }
  const [form, setForm] = useState<Form>(initialFormState[mode]);
  const [eventId, setEventId] = useState<string>(poll?.event._id || '');
  const debouncedFormValue = useDebounce(form, 500);

  const [pollType, setPollType] = useState(poll?.type || '');

  const [loading, setLoading] = useState(false);
  const { user } = useMySelector(state => state.auth);
  const userId = user?.id;

  const [formValid, setFormValid] = useState(false);

  const pollMCValid = pollType === 'multiple choice' ? options.length > 1 : true;

  const pollValid = formValid && eventId !== '' && pollType !== '' && pollMCValid;

  let {
    errors,
    validateForm,
    onBlurField,
  }: {
    errors: IErrors,
    validateForm: Function,
    onBlurField: FocusEventHandler,
  } = useLoginFormValidator(form);

  useEffect(() => {
    console.log(errors);
  }, [form, formValid, eventId, pollType, pollMCValid])

  useEffect(() => {
    const { isFormValid } = validateForm({
      form,
      errors,
    });
    setFormValid(isFormValid);
  }, [form]);

//scrolling
const scrollToTop = () => {
  if (pollTitleRef.current) {
    pollTitleRef.current.scrollIntoView({ behavior: "smooth" });
  }
};

useEffect(() => {
  scrollToTop();
}, []);
  //Form handlers
  const manageStateWithNewOptions = (newOptions: Option[]) => {
    setOptions(newOptions);
    const title = form.title;
    const mappedOptions = newOptions.reduce((acc: any, curr,) => {
      acc[`option${curr.id}`] = curr.value;
      return acc;
    }, {});
    const nextFormState = {
      title,
      ...mappedOptions,
    };
    setForm(nextFormState);
  }

  const onUpdateField = (ev: any) => {
    const field = ev.target.name;
    const value = ev.target.value;

    if (field.includes('option')) {
      const id = field.slice(6);
      const index = options.findIndex(option => option.id === id);
      const newOptions = [...options];
      newOptions[index].value = value;
      manageStateWithNewOptions(newOptions);
      errors[field].dirty = true;
      return;
    }

    const nextFormState = {
      ...form,
      [field]: value,
    };
    errors[field].dirty = true;
    setForm(nextFormState);
  };

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
    if (userId && pollValid) {
      const poll = {
        title: form.title,
        type: pollType,
        options: options.map(option => option.value),
        eventId,
        userId,
      };
      console.log(poll);
      pollsService
        .createPoll(poll)
        .then((data) => {
          console.log(data);
          hidePollForm(true, eventId);
          setLoading(false);
        })
        .catch(err => {
          console.log(err);
          setLoading(false);
        });
    }
    // hidePollForm(false);
    setLoading(false);
  };

  //poll setup handling

  const handleSetMCPoll = (ev: any) => {
    ev.preventDefault();
    setPollType(pollTypes.mc);
    const newId = idGenerator();
    setOptions(options => [...options, { id: newId, value: '' }]);

    errors[`option${newId}`] = {
      dirty: false,
      error: false,
      message: '',
    };
  }

  const handleMCOptionAdd = (index: string) => (ev: any) => {
    ev.preventDefault();
    const newOptions = [...options];
    const insertIndex = newOptions.findIndex(option => option.id === index);
    const newId = idGenerator();
    newOptions.splice(insertIndex + 1, 0, { id: newId, value: '' });
    manageStateWithNewOptions(newOptions);
    const optionName = `option${newId}`;
    errors[optionName] = {
      dirty: false,
      error: false,
      message: '',
    };
  }

  const handleMCOptionRemove = (index: string) => (ev: any) => {
    ev.preventDefault();
    const newOptions = [...options];
    const spliceIndex = newOptions.findIndex(option => option.id === index);
    newOptions.splice(spliceIndex, 1);
    manageStateWithNewOptions(newOptions);
    // errors = { ...errors };
  }

  const handleEventSelect = (ev: any) => {
    const value = ev.target.value;
    setEventId(value);
  }

  const handleFormClose = (ev: any) => {
    ev.preventDefault();
    hidePollForm(false, eventId);
  }

  return (
    <>
      <div className={styles.formTitle}>
        <h2 ref={pollTitleRef}>{mode === 'edit' ? 'Edit poll' : 'Create a poll'}</h2>
        <p>Choose heading and type for your event.
          A multiple choice poll allows you to add more possible answers
          When you are finished click <b>"Create event"</b> to publish it.</p>
      </div>

      <form
        className={styles.form}
        onSubmit={onSubmitForm}
      >
        <div className={styles.selectInput}>
          <select value={eventId} name="eventSelect" onChange={handleEventSelect}>
            <option value=''>Select an event for your poll</option>
            {events.map(event => (
              <option key={event.id} value={event.id}>{event.title}</option>
            ))}
          </select>
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Type a question</label>
          <input
            className={clsx(
              styles.formField,
              errors.title.dirty && errors.title.error && styles.formFieldError,
            )}
            type="text"
            aria-label='Title field'
            name='title'
            placeholder="E.g What is your favourite movie?"
            value={form.title}
            onChange={onUpdateField}
            onBlur={onBlurField}
          />
          {errors.title.dirty && errors.title.error
            ? (<p className={styles.formFieldErrorMessage}>{errors.title.message}</p>)
            : null}
        </div>

        <p className={styles.formInstructions}>Select a type for your poll</p>
        <div className={styles.selectGroup}>
          <button
            type='button'
            onClick={handleSetMCPoll}
            className={pollType === pollTypes.mc ? styles.typeSelected : ''}
          >
            Multiple Choice
          </button>
          <button
            type='button'
            onClick={() => setPollType(pollTypes.oa)}
            className={pollType === pollTypes.oa ? styles.typeSelected : ''}
          >
            Open Answer
          </button>
          <button
            type='button'
            onClick={() => setPollType(pollTypes.rating)}
            className={pollType === pollTypes.rating ? styles.typeSelected : ''}
          >
            Rating
          </button>
        </div>

        <div className={styles.optionGroup}>
          {pollType === pollTypes.mc && options.length > 0 &&
            options
              .map((option: Option) =>
                <PollOptionInput
                  key={option.id}
                  index={option.id}
                  name={`option${option.id}`}
                  value={option.value}
                  errors={errors}
                  onUpdateField={onUpdateField}
                  onBlurField={onBlurField}
                  onMcOptionAdd={handleMCOptionAdd}
                  onMcOptionRemove={handleMCOptionRemove}
                />
              )
          }
        </div>

        <div className={styles.formActions}>
          <button
            className={styles.formSubmitBtn}
            type="submit"
            disabled={!pollValid || loading}
          >
            {!loading && <p>Create poll</p>}
            {loading && <p>...Loading</p>}
          </button>
          <button
            className={styles.formCancelBtn}
            onClick={handleFormClose}
          >
            Cancel
          </button>
        </div>
      </form>
    </>
  )
}

export default PollForm;