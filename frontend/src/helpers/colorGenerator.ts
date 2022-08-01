const genColor = () => {
    const h = 180;
    const s = Math.floor(Math.abs(Math.random() - 0.5) * 100);
    let l = Math.floor(Math.random() * 100);
    if (l < 20) {
        l = 20;
    }
    if (l > 80) {
        l = 80;
    }
    return `hsl(${h}, ${s}%, ${l}%)`;
}

export { genColor };