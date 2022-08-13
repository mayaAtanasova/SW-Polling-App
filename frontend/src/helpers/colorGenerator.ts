const genColor = () => {
    const h = 180;
    const s = Math.floor(Math.abs(Math.random()) * 100);
    let l = Math.floor(Math.random() * 100);
    if (l < 10) {
        l = 10;
    }
    if (l > 90) {
        l = 90;
    }
    return `hsl(${h}, ${s}%, ${l}%)`;
}

const genColourfulColor = () => {
    return "hsl(" + 360 * Math.random() + ',' +
    (20 + 70 * Math.random()) + '%,' + 
    (65 + 15 * Math.random()) + '%)'
}

export { genColor, genColourfulColor };