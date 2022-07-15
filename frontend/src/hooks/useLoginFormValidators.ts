import { useEffect, useState } from 'react';
import {
    nameValidator,
    emailValidator,
    passwordValidator,
    confrimPasswordValidator,
} from './validators';
import { IErrors } from '../Interfaces/IError';
import { IForm } from '../Interfaces/IForm';

const touchErrors = (errors: IErrors): IErrors => {
    return Object.entries(errors).reduce((acc, [field, fieldError]) => {
        acc[field] = {
            ...fieldError,
            dirty: true,
        };
        return acc;
    }, errors);
};

export const useLoginFormValidator = (form: IForm) => {

    const fieldNames = Object.keys(form);

    const initialState: IErrors = fieldNames.reduce((acc, fieldName) => ({
        ...acc,
        [fieldName]: {
            dirty: false,
            error: false,
            message: '',
        },
    }), {});

    const validatorsDict: {
        [key: string]: Function,
    } = ({
        'firstName': nameValidator,
        'lastName': nameValidator,
        'email': emailValidator,
        'password': passwordValidator,
        'confirmPassword': confrimPasswordValidator,
    });

    const [errors, setErrors] = useState(initialState);

    const validateForm = ({ form, errors, forceTouchErrors }: { form: IForm, errors: IErrors, forceTouchErrors: boolean }) => {

        //create a deep copy of the errors object
        let nextErrors:IErrors = JSON.parse(JSON.stringify(errors));

        //force validate all the fields on submit form
        if (forceTouchErrors) {
            nextErrors = touchErrors(errors);
        }

        fieldNames.forEach(fieldName => {
            const fieldValue = form[fieldName];
            if (nextErrors[fieldName].dirty) {
                const error = validatorsDict[fieldName](fieldValue, form.password);
                nextErrors[fieldName].error = !!error;
                nextErrors[fieldName].message = error;
            };
        });
        const formErrors = Object.values(nextErrors);
        const isFormValid = formErrors.every(error => error.dirty) && formErrors.every(field => !field.error);
        setErrors(nextErrors);

        return {
            isFormValid,
            errors: nextErrors,
        };

    };

    const onBlurField = (e: any) => {
        const field: string = e.target.name;

        let updatedErrors = {
            ...errors
        };

        updatedErrors[field].dirty = true;

        validateForm({ form, errors: updatedErrors, forceTouchErrors: false });
    };

    return {
        validateForm,
        onBlurField,
        errors,
    };

};
