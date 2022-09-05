// @ts-check

// -- Types --------------------------------------------------------------------

/** @typedef {{ min: number; max: number }} Range */

// -- Typography ---------------------------------------------------------------

/**
 * Capitalizes a string.
 *
 * @param {string} text
 *
 * @returns {string}
 */
export const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1);

/**
 * Capitalizes each word in a string.
 *
 * @param {string} words
 *
 * @returns {string}
 */
export const capitalizeWords = (words) => words.split(' ').map((word) => capitalize(word)).join(' ');

/**
 * Returns the correct indefinite article for the given word.
 *
 * @param {string} word
 *
 * @returns {string}
 */
export function indefiniteArticle(word) {
    if ('aeiou'.indexOf(word[0].toLowerCase()) >= 0) {
        return 'an';
    }

    return 'a';
}

/**
 * Pluralize
 *
 * @param {number} count
 * @param {string} string
 * @param {string} [suffix = 's']
 *
 * @returns {string}
 */
export function pluralize(count, string, suffix = 's') {
    return `${string}${count !== 1 ? suffix : ''}`;
}

/**
 * Returns a comma separated list, joining the last two words with "and", for
 * use in a sentence.
 *
 * @param {string[]} parts
 *
 * @returns {string}
 */
export function sentenceList(parts) {
    if (parts.length === 0) {
        return;
    }

    let last = parts.pop();

    if (parts.length === 0) {
        return last;
    }

    let comma = parts.length > 1 ? ',' : '';

    return `${parts.join(', ')}${comma} and ${last}`;
}

/**
 * Converts spaces to dashes.
 *
 * @param {string} text
 *
 * @returns {string}
 */
export const toDash = (text) => text.replace(/\s+/g, '-').toLowerCase();

/**
 * Converts camel case to words.
 *
 * @param {string} text
 *
 * @returns {string}
 */
export const toWords = (text) => text.replace(/([A-Z])/g, ' $1').toLowerCase();

// -- Numeric ------------------------------------------------------------------

/**
 * Returns true if the given number is even.
 *
 * @param {number} num
 *
 * @returns {boolean}
 */
export const isEven = (num)  => num % 2 === 0;

/**
 * Returns true if the given number is odd.
 *
 * @param {number} num
 *
 * @returns {boolean}
 */
export const isOdd = (num)  => num % 2 !== 0;

// -- Array --------------------------------------------------------------------

/**
 * Returns the given array chunked by size.
 *
 * @param {*[]} array
 * @param {number} size
 *
 * @returns {*[][]}
 */
export const chunk = (array, size) => array.reduce((newArray, item, index) => {
    let chunkIndex = Math.floor(index / size);

    if (!newArray[chunkIndex]) {
        newArray[chunkIndex] = [];
    }

    newArray[chunkIndex].push(item);

    return newArray;
}, []);

// -- Object -------------------------------------------------------------------

/**
 * Returns an object containing min & max number ranges for each provided key
 * & min value pair.
 *
 * @param {{ [key: string]: number }} minimums
 *     An object of minimums values.
 *
 * @param {number} [maximum = Number.POSITIVE_INFINITY]
 *     Maximum value for the largest quantity
 *
 * @returns {{ [key: string]: Range }}
 */
export function createRangeLookup(minimums, maximum = Number.POSITIVE_INFINITY) {
    let entries = Object.entries(minimums || {});

    entries.length < 1 && toss('Invalid minimums object given in createRangeLookup()');

    return entries.reduce((ranges, quantity, index, lookup) => {
        let [ key, min ] = quantity;

        let next = index + 1;
        let max  = lookup[next] ? lookup[next][1] - 1 : maximum;

        max < min && toss(`Max cannot be less than min in in createRangeLookup() for key "${key}"`);

        ranges[key] = { min, max };

        return ranges;
    }, {});
}

// -- Throw --------------------------------------------------------------------

/**
 * Throws a type error.
 *
 * @param {string} message
 *
 * @throws
 *
 * @returns {never}
 */
export const toss = (message) => { throw new TypeError(message); };

/**
 * Throws a type error if the given value is undefined.
 *
 * @param {any} value
 * @param {string} message
 *
 * @throws
 */
export function isRequired(value, message) {
    typeof value === 'undefined' && toss(message);
}

// -- Error Handling -----------------------------------------------------------

/**
 * Returns an error message
 *
 * @param {any} error
 *
 * @returns {string}
 */
export const getErrorMessage = (error) => {
    if (typeof error === 'string') {
        return error;
    }

    if (error?.stack) {
        return error.stack.toString();
    }

    if (typeof error === 'object') {
        try {
            return JSON.stringify(error);
        } catch (err) {
            return 'Unable to stringify object: ' + err.stack.toString();
        }
    }

    return 'Unknown error type: ' + String(error);
};
