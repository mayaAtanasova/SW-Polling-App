import { IEvent } from "./IEvent";
import { IUser } from "./IUser";

export default interface IRootState {
    event: {
        eventId: string | null,
        event: IEvent | null,
        loggedInChat: boolean,
        voted: boolean,
        loading: boolean,
    },
    auth: {
        user: IUser | null,
        isAuthenticated: boolean,
        isAdmin: boolean | null,
        loading: boolean,
    },
}