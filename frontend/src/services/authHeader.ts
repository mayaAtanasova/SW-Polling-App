export default function authHeader() {
    // return authorization header with jwt token
    const tokenStr = localStorage.getItem('token');
    let token: string | null
    if (tokenStr) {
        token = JSON.parse(tokenStr);
        return { 'Authorization': 'Bearer ' + token };
        // return { 'x-access-token': token };
    } else {
        return {};
    }
}