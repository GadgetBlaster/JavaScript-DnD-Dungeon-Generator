// @ts-check

import { toss } from './tools.js';

// -- Types --------------------------------------------------------------------

/**
 * @typedef {object} Probability
 *     Probability distribution table.
 *
 * @prop {string} description
 * @prop {() => string} roll
 */

// -- Config -------------------------------------------------------------------

const minPercent = 0;
const maxPercent = 100;

// -- Public Functions ---------------------------------------------------------

/**
 * Returns a probability roll and description in a closure.
 *
 * @param {[ number, string ][]} config
 *
 * @returns {Probability}
 */
export function createProbability(config) {
    !Array.isArray(config) && toss('Probability `config` must be an array');
    !config.length && toss('Probability config must have values');

    let map;

    try {
        map = new Map(config);
    } catch (e) {
        toss('Invalid `config` for Map in `createProbability()`');
    }

    map.forEach((value, key) => {
        typeof value !== 'string' && toss(`Probability value "${value}" must be a string`);
        !Number.isInteger(key) && toss(`Probability key "${key}" must be an integer`);

        key < minPercent && toss(`Probability key "${key}" must be ${minPercent} or greater`);
        key > maxPercent && toss(`Probability key "${key}" exceeds ${maxPercent}`);
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
        },
    };
}

/**
 * Rolls an integer between min and max inclusively.
 *
 * @throws
 *
 * @param {number} [min = 0]
 * @param {number} [max = 1]
 *
 * @returns {number}
 */
export function roll(min = 0, max = 1) {
    !Number.isInteger(min) && toss('Roll `min` must be an integer');
    !Number.isInteger(max) && toss('Roll `max` must be an integer');

    min < 0   && toss('Roll `min` cannot be negative');
    min > max && toss('Roll `min` must less than or equal to `max`');

    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Roll array item
 *
 * @throws
 *
 * @param {any[] | readonly any[]} array
 *
 * @returns {*}
 */
export function rollArrayItem(array) {
    !Array.isArray(array) && toss('Invalid roll array');
    !array.length && toss('Roll array must have values');

    return array[Math.floor(Math.random() * array.length)];
}

/**
 * Roll percentile
 *
 * @throws
 *
 * @param {number} chance
 *
 * @returns {boolean}
 */
export function rollPercentile(chance) {
    !Number.isInteger(chance) && toss('rollPercentile() chance must be an integer');
    chance < minPercent && toss(`rollPercentile() chance must be ${minPercent} or greater`);
    chance > maxPercent && toss(`rollPercentile() chance cannot exceed ${maxPercent}`);

    if (chance === 0) {
        return false;
    }

    return roll(minPercent, maxPercent) <= chance;
}
