import { IEvent } from "./IEvent";
import { IUser, IUserCompact } from "./IUser";

export default interface IRootState {
    event: {
        eventId: string | null,
        event: IEvent | null,
        loggedInChat: boolean,
        voted: boolean,
        loading: boolean,
    },
    auth: {
        user: IUserCompact | null,
        isAuthenticated: boolean,
        isAdmin: boolean | null,
        loading: boolean,
    },
}