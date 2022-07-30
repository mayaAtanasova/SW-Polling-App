export default interface UserInterface {
    _id: string;
    email: string,
    hashedp: string,
    googleId?: string,
    displayName: string,
    firstName: string,
    lastName: string,
    role: string,
    vpoints: number,
    _v: number,
}