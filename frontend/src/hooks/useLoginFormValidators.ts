import { useEffect, useState } from 'react';
import {
    nameValidator,
    eventTitleValidator,
    emailValidator,
    passwordValidator,
    confrimPasswordValidator,
} from '../helpers/validators';
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

    const fields = Object.entries(form);

    const initialState: IErrors = fields.reduce((acc, field) => ({
        ...acc,
        [field[0]]: {
            dirty: !!field[1],
            error: false,
            message: '',
        },
    }), {});
    
    const [errors, setErrors] = useState(initialState);

    const validatorsDict: {
        [key: string]: Function,
    } = ({
        'firstName': nameValidator,
        'lastName': nameValidator,
        'email': emailValidator,
        'password': passwordValidator,
        'confirmPassword': confrimPasswordValidator,
        'title': nameValidator,
        'eventTitle': eventTitleValidator,
        'description': nameValidator,
        'type': nameValidator,
    });


    const validateForm = ({ form, errors, forceTouchErrors }: { form: IForm, errors: IErrors, forceTouchErrors: boolean }) => {

        //create a deep copy of the errors object
        let nextErrors: IErrors = JSON.parse(JSON.stringify(errors));

        //force validate all the fields on submit form
        if (forceTouchErrors) {
            nextErrors = touchErrors(errors);
        }

        fields.forEach(field => {
            const fieldValue = field[1];
            const fieldName = field[0];
            if (nextErrors[fieldName].dirty) {
                let error;
                if (fieldName in validatorsDict) {
                    error = validatorsDict[fieldName](fieldValue, form.password);
                } else {
                    error = nameValidator(fieldValue);
                }
                nextErrors[fieldName].error = !!error;
                nextErrors[fieldName].message = error;
            }
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
