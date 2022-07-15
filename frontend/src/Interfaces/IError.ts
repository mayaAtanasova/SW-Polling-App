export interface IError {
    dirty: boolean;
    error: boolean;
    message: string;
}

export interface IErrors {
    [key: string]: IError;
}