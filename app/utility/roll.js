
const minPercent = 1;
const maxPercent = 100;

/**
 * Throw
 *
 * @private
 *
 * @param {string} message
 *
 * @throws
 */
const _throw = (message) => { throw new TypeError(message); };

/**
 * Roll
 *
 * @param {number} [min=0]
 * @param {number} [max=1]
 *
 * @throws
 *
 * @returns {number}
 */
export const roll = (min = 0, max = 1) => {
    !Number.isInteger(min) && _throw('Roll `min` must be an integer');
    !Number.isInteger(max) && _throw('Roll `max` must be an integer');

    min < 0   && _throw('Roll `min` cannot be negative');
    min > max && _throw('Roll `min` must less than or equal to `max`');

    return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Roll array item
 *
 * @param {Array} array
 *
 * @throws
 *
 * @returns {*}
 */
export const rollArrayItem = (array) => {
    !Array.isArray(array) && _throw('Invalid roll array');
    !array.length && _throw('Roll array must have values');

    return array[Math.floor(Math.random() * array.length)];
};

/**
 * Roll percentile
 *
 * @param {number} change
 *
 * @throws
 *
 * @returns {boolean}
 */
export const rollPercentile = (chance) => {
    !Number.isInteger(chance) && _throw('Percent `chance` must be an integer');
    chance < minPercent && _throw(`Percent \`chance\` must be ${minPercent} or greater`);
    chance > maxPercent && _throw(`Percent \`chance\` cannot exceed ${maxPercent}`);

    return roll(minPercent, maxPercent) <= chance;
};

/**
 * Probability
 *
 * @typedef {Object} Probability
 *
 * @property {string} description
 * @property {() => string)} roll
 */

/**
 * Create probability
 *
 * @todo Each entry should have a probability key that is a fixed percent
 *     instead of building upon the last key. For example:
 *     `[[ 20, 'boats' ], [ 10, 'horses' ]]` for 1-20: boats, 21-30: horses
 *     instead of the current api:
 *     `[[ 20, 'boats' ], [ 30, 'horses' ]]` for 1-20: boats, 21-30: horses
 *     Then sort by largest % first and validate the total is 100 or less.
 *
 * @param {[number, string][]} config
 *
 * @returns {Probability}
 */
export const createProbability = (config) => {
    !Array.isArray(config) && _throw('Probability `config` must be an array');
    !config.length && _throw('Probability config must have values');

    let map;

    try {
        map = new Map(config);
    } catch(e) {
        throw new TypeError('Invalid `config` for Map');
    }

    map.forEach((value, key) => {
        typeof value !== 'string' && _throw(`Probability value "${value}" must be a string`);
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
};
