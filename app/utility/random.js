
export const random = 'random';

const getRandomInt = (min = 0, max = 1) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const getRandomArrayItem = (array) => {
    return array[Math.floor(Math.random() * array.length)];
};
