export interface IUser {
    id?: string;
    email: string;
    password: string;
    confirmPassword?: string;
    firstName: string;
    lastName: string;
    displayName?: string;
    role?: string;
    vpoints?:number;
}

export interface IUserCompact {
    id: string;
    email: string;
    displayName: string;
    vpoints:number;
}