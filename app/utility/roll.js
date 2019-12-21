
export const roll = (min = 0, max = 1) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const rollArrayItem = (array) => {
    return array[Math.floor(Math.random() * array.length)];
};
