export interface IUser {
    id?: string;
    email: string;
    password: string;
    confirmPassword?: string;
    firstName: string;
    lastName: string;
    displayName?: string;
    role?: string;
}