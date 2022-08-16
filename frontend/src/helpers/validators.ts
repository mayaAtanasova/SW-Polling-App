import isEmail from 'validator/lib/isEmail';

export const nameValidator = (name: string): string => {
    if (!name) {
        return 'The field is required';
    }
    return '';
};

export const eventTitleValidator = (title: string): string => {
    if (!title) {
        return 'The event title is required';
    }
    const regexp = /^((\w+)-?)*\w+$/;
    console.log(regexp)
    if(!regexp.test(title)) {
        return 'Only letters, numbers, and dashes in between are allowed, e.g. "my-event"';
    }
    return '';
}

export const emailValidator = (email: string): string => {
    if (!email) {
        return 'Email is required';
    } else if (!isEmail(email)) {
        return 'Email is invalid';
    }
    return '';
};

export const passwordValidator = (password: string): string => {
    if (!password) {
        return 'Password is required';
    } else if (password.length < 8) {
        return 'Password must be at least 8 characters';
    }
    return '';
};

export const confrimPasswordValidator = (confirmPassword: string, password: string): string => {
    if (!confirmPassword) {
        return 'Confirm Password is required';
    } else if (password !== confirmPassword) {
        return 'Passwords do not match';
    }
    return '';
};

