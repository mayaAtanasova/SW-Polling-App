const users: {
    id: string,
    displayName: string,
    room: string
}[] = [];

const userJoin = (id:string, displayName:string, room:string) => {
    const user = { id, displayName, room };
    users.push(user);
    return user;
};

const getCurrentUser = (id:string) => {
    return users.find(user => user.id === id);
};

const userLeave = (id:string) => {
    const index = users.findIndex(user => user.id === id);
    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
};

const getRoomUsers = (room:string) => {
    return users.filter(user => user.room === room);
};

export {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
}