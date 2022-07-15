export interface IUser {
    _id?: string;
    email: string;
    password: string;
    confirmPassword?: string;
    firstName: string;
    lastName: string;
    role?: string;
}