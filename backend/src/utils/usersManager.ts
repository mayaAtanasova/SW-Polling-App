
type User = {
    sid: string,
    uid: string,
    displayName: string,
    eventTitle: string
}
const users: User[] = [];

const addUser = (socketId: string, userId: string, displayName: string) => {
    const user = { sid: socketId, uid: userId, displayName, eventTitle: '' };
    const index = users.findIndex(user => user.uid === userId);
    if (index === -1) {
    users.push(user);
    }
    return user;
}

const userJoinEvent = (sid:string, uid: string, displayName:string, eventTitle:string) => {
    let user: User;
    const index = users.findIndex(user => user.uid === uid);
    if (index !== -1) {
        user = { ... users[index], eventTitle, sid };
        users.splice(index, 1, user);
    } else {
        user = { sid, uid, displayName, eventTitle };
        users.push(user);
    }
    return user;
};
const userLeaveEvent = (sid:string, eventTitle:string) => {
    const user = users.find(user => user.sid === sid);
    return user;
}

const getCurrentUser = (sid:string) => {
    return users.find(user => user.sid === sid);
};

const userDisconnect = (sid:string) => {
    const index = users.findIndex(user => user.sid === sid);
    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
};

const getEventUsers = (eventTitle:string) => {
    const eventUsers = users.filter(user => user.eventTitle === eventTitle);
    return eventUsers;
};

export {
    addUser,
    userJoinEvent,
    getCurrentUser,
    userDisconnect,
    userLeaveEvent,
    getEventUsers
}