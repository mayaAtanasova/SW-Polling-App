const genColor = () => {
    const h = 180;
    const s = Math.floor(Math.random() * 100);
    const l = Math.floor(Math.random() * 80);
    return `hsl(${h}, ${s}%, ${l}%)`;
}

export { genColor };