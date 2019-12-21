
export const roll = (min = 0, max = 1) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const rollArrayItem = (array) => {
    return array[Math.floor(Math.random() * array.length)];
};

const _throw = (m) => { throw m; }

const minProbability = 1;
const maxProbability = 100;

export function Probability(config) {
    !Array.isArray(config) && _throw(`Probability config must be an array`)

    let map = new Map(config);

    map.forEach((_, key) => {
        !Number.isInteger(key) && _throw(`Probability key "${key}" must be an integer`);
        key < minProbability   && _throw(`Probability key "${key}" must be a positive integer`);
        key > maxProbability   && _throw(`Probability key "${key}" exceeds 100`);
    });

    let sorted = [ ...map.keys() ].sort((a, b) => a - b);

    return {
        roll: () => {
            let result = roll(minProbability, maxProbability);
            let key    = sorted.find((val) => result <= val);

            return map.get(key);
        }
    };
};
