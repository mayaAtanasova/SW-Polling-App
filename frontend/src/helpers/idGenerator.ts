export const idGenerator = () => {
    return ((1 << 24) * Math.random() | 0).toString(16);
}