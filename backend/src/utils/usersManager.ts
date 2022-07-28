const users: {
    sid: string,
    displayName: string,
    eventTitle: string
}[] = [];

const userJoin = (sid:string, displayName:string, eventTitle:string) => {
    const user = { sid, displayName, eventTitle };
    users.push(user);
    return user;
};

const getCurrentUser = (sid:string) => {
    return users.find(user => user.sid === sid);
};

const userLeave = (sid:string) => {
    const index = users.findIndex(user => user.sid === sid);
    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
};

const getEventUsers = (eventTitle:string) => {
    return users.filter(user => user.eventTitle === eventTitle);
};

export {
    userJoin,
    getCurrentUser,
    userLeave,
    getEventUsers
}