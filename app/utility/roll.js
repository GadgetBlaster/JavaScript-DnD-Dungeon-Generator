
const minPercent = 1;
const maxPercent = 100;

const _throw = (m) => { throw new Error(m); };

export const roll = (min = 0, max = 1) => {
    !Number.isInteger(min) && _throw(`Roll min must be an integer`);
    !Number.isInteger(max) && _throw(`Roll max must be an integer`);

    min < 0   && _throw(`Min cannot be negative`);
    min > max && _throw('Min must less than or equal to max');

    return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const rollPercentile = (chance) => {
    !Number.isInteger(chance) && _throw(`Percent chance must be an integer`);
    chance < minPercent && _throw(`Percent chance must be ${minPercent} or greater`);
    chance > maxPercent && _throw(`Percent chance exceeds ${maxPercent}`);

    return roll(minPercent, maxPercent) <= chance;
};

export const rollArrayItem = (array) => {
    return array[Math.floor(Math.random() * array.length)];
};

export function Probability(config) {
    !Array.isArray(config) && _throw('Probability config must be an array');

    let map = new Map(config);

    map.forEach((_, key) => {
        !Number.isInteger(key) && _throw(`Probability key "${key}" must be an integer`);
        key < minPercent && _throw(`Probability key "${key}" must be ${minPercent} or greater`);
        key > maxPercent && _throw(`Probability key "${key}" exceeds ${maxPercent}`);
    });

    let sorted = [ ...map.keys() ].sort((a, b) => a - b);

    let description = 'Random probability: ' + sorted.reduce((acc, key, index) => {
        let prev  = sorted[index - 1];
        let start = prev ? (prev + 1) : 1;
        let end   = key;

        acc.push(`${start}-${end}% ${map.get(key)}`);

        return acc;
    }, []).join(', ');

    return {
        description,
        roll: () => {
            let result = roll(minPercent, maxPercent);
            let key    = sorted.find((val) => result <= val);

            return map.get(key);
        }
    };
}
