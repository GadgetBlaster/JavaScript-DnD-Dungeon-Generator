// @ts-check

import { toss } from './tools.js';

// -- Config -------------------------------------------------------------------

const minPercent = 0;
const maxPercent = 100;

// -- Public Functions ---------------------------------------------------------

/**
 * Returns a probability roll and description in a closure.
 *
 * @throws
 *
 * @param {Map<number, any>} distributionTable
 *
 * @returns {Readonly<{
 *   description: string;
 *   roll: () => any;
 * }>}
 */
export function createProbability(distributionTable) {
    !(distributionTable instanceof Map) && toss('distributionTable must be a Map in createProbability()');
    !distributionTable.size && toss('distributionTable Map must have values in createProbability()');

    distributionTable.forEach((value, key) => {
        !Number.isInteger(key) && toss(`distributionTable key "${key}" must be an integer in createProbability()`);

        key < minPercent && toss(`distributionTable key "${key}" must be ${minPercent} or greater in createProbability()`);
        key > maxPercent && toss(`distributionTable key "${key}" exceeds ${maxPercent} in createProbability()`);
    });

    let sorted = [ ...distributionTable.keys() ].sort((a, b) => a - b);

    let description = 'Random probability: ' + sorted.reduce((acc, key, index) => {
        let prev  = sorted[index - 1];
        let start = prev ? (prev + 1) : 1;
        let end   = key;

        acc.push(`${start}-${end}% ${distributionTable.get(key)}`);

        return acc;
    }, []).join(', ');

    return Object.freeze({
        description,
        roll: () => {
            let result = roll(minPercent, maxPercent);
            let key    = sorted.find((val) => result <= val);

            return distributionTable.get(key);
        },
    });
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
    !Number.isInteger(min) && toss('min must be an integer in roll()');
    !Number.isInteger(max) && toss('max must be an integer in roll()');

    min < 0   && toss('min cannot be negative in roll()');
    min > max && toss('min must less than or equal to max in roll()');

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
    !Array.isArray(array) && toss('Invalid array in rollArrayItem()');
    !array.length && toss('array must have values in rollArrayItem()');

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
    !Number.isInteger(chance) && toss('chance must be an integer in rollPercentile()');
    chance < minPercent && toss(`chance must be ${minPercent} or greater in rollPercentile()`);
    chance > maxPercent && toss(`chance cannot exceed ${maxPercent} in rollPercentile()`);

    if (chance === 0) {
        return false;
    }

    return roll(minPercent, maxPercent) <= chance;
}
