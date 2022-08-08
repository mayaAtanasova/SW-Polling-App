import clsx from 'clsx';
import { FocusEventHandler, useEffect, useState } from 'react';
import useDebounce from '../../../../hooks/useDebounce';
import { useLoginFormValidator } from '../../../../hooks/useLoginFormValidators';
import { useMySelector } from '../../../../hooks/useReduxHooks';
import { IErrors } from '../../../../Interfaces/IError';
import { IPoll } from '../../../../Interfaces/IPoll';
import PollOptionInput from './PollOptionInput';

import styles from './PollForm.module.css';

type formProps = {
  hidePollForm: (ev?: any) => void,
}

type Form = { [key: string]: string }

const pollTypes = {
  mc: 'multiple choice',
  oa: 'open answer',
  rating: 'rating',
}

const PollForm = ({ hidePollForm }: formProps) => {

  const [pollType, setPollType] = useState('');
  const [options, setOptions] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);
  const { user } = useMySelector(state => state.auth);
  const userId = user?.id;

  const [form, setForm] = useState<Form>({ title: '' });

  const [formValid, setFormValid] = useState(false);

  const pollValid = formValid && pollType !== '';

  useEffect(() => {
    console.log(form);
  }, [form]);

  useEffect(() => {
    console.log(options);
  }, [options]);

  const onUpdateField = (ev: any) => { 
    const field = ev.target.name;
    const value = ev.target.value;

    if (field.includes('option')) {
      const index = Number(field.slice(6));
      const newOptions = [...options];
      newOptions[index] = value;
      setOptions(newOptions);
      const title = form.title;
      const mappedOptions = newOptions.reduce((acc:any, curr, i) => {
        acc[`option${i}`] = curr;
        return acc;
      } , {});
      const nextFormState = {
        title,
        ...mappedOptions,
      };
      setForm(nextFormState);
    }

    const nextFormState = {
      ...form,
      [field]: value,
    };
    setForm(nextFormState);
  };

  const onValidateField = () => {

  };

  const onBlurField = () => { };

  const onSubmitForm = (e: any) => { };

  //poll type handling

  const handleSetMCPoll = (ev: any) => {
    ev.preventDefault();
    setPollType(pollTypes.mc);
    setOptions(options => [''])
  }

  const handleMCOptionAdd = (ev: any) => {
    ev.preventDefault();
    const newOptions = [...options, ''];
    setOptions(newOptions);

    const title = form.title;
    const mappedOptions = newOptions.reduce((acc:any, curr, i) => {
      acc[`option${i}`] = curr;
      return acc;
    } , {});
    console.log(mappedOptions);
    const newFormState = {
      title,
      ...mappedOptions,
    }
    setForm(newFormState);
    console.log(newFormState);
  }

  const handleMCOptionRemove = (index:number) => (ev: any) => {
    ev.preventDefault();
    const newOptions = [...options];
    newOptions.splice(index, 1);
    setOptions(newOptions);

    const title = form.title;
    const mappedOptions = newOptions.reduce((acc:any, curr, i) => {
      acc[`option${i}`] = curr;
      return acc;
    } , {});
    console.log(mappedOptions);
    const newFormState = {
      title,
      ...mappedOptions,
    }
    console.log(newFormState);
  }

  return (
    <>
      <div className={styles.formTitle}>
        <h2>Create a poll</h2>
        <p>Choose heading and type for your event.
          A multiple choice poll allows you to add more possible answers
          When you are finished click <b>"Create event"</b> to publish it.</p>
      </div>

      <form
        className={styles.form}
        onSubmit={onSubmitForm}
      >

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Type a question</label>
          <input
            className={clsx(
              styles.formField,
            )}
            type="text"
            aria-label='Title field'
            name='title'
            placeholder="E.g What is your favourite movie?"
            value={form.title}
            onChange={onUpdateField}
            onBlur={onBlurField}
          />

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
              .map((option: string, index: number) => 
              <PollOptionInput
              key={index}
              index={index}
              name={`option${index}`}
              value={option}
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
            onClick={hidePollForm}
          >
            Cancel
          </button>
        </div>
      </form>
    </>
  )
}

export default PollForm;