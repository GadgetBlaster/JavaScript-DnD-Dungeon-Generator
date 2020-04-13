
/**
 * Assertion result
 *
 * @typedef {Object} AssertionResult
 *     @property {string} msg
 *     @property {boolean} isOk
 */

/**
 * Assertion
 *
 * @typedef {Function} Assertion
 *
 * @param {*} actual
 * @param {*} expected
 *
 * @returns {AssertionResult}
 */

/** @type {Assertion} equals */
export const equals = (actual, expected) => {
    let isOk = expected === actual;
    let msg  = `expected [ ${actual} ] to equal [ ${expected} ]`;

    return { msg, isOk };
};

/** @type {Assertion} isArray */
export const isArray = (value) => {
    let isOk = Array.isArray(value);
    let msg  = `expected [ ${value} ] to be an Array`;

    return { msg, isOk };
};

/** @type {Assertion} isBoolean */
export const isBoolean = (value) => {
    let isOk = typeof value === 'boolean';
    let msg  = `expected [ ${value} ] to be a Boolean`;

    return { msg, isOk };
};

/** @type {Assertion} isFalse */
export const isFalse = (value) => {
    let isOk = isBoolean(value) && value === false;
    let msg  = `expected [ ${value} ] to be False`;

    return { msg, isOk };
};

/** @type {Assertion} isNull */
export const isNull = (value) => {
    let isOk = value === null;
    let msg  = `expected [ ${value} ] to be a Null`;

    return { msg, isOk };
};

/** @type {Assertion} isNumber */
export const isNumber = (value) => {
    let isOk = typeof value === 'number' && !isNaN(value);
    let msg  = `expected [ ${value} ] to be a Number`;

    return { msg, isOk };
};

/** @type {Assertion} isObject */
export const isObject = (value) => {
    let isOk = !!value && typeof value === 'object' && !Array.isArray(value);
    let msg  = `expected [ ${value} ] to be an Object`;

    return { msg, isOk };
};

/** @type {Assertion} isString */
export const isString = (value) => {
    let isOk = typeof value === 'string';
    let msg  = `expected [ ${value} ] to be a String`;

    return { msg, isOk };
};

/** @type {Assertion} isTrue */
export const isTrue = (value) => {
    let isOk = isBoolean(value) && value === true;
    let msg  = `expected [ ${value} ] to be True`;

    return { msg, isOk };
};

/** @type {Assertion} isUndefined */
export const isUndefined = (value) => {
    let isOk = value === undefined;
    let msg  = `expected [ ${value} ] to be Undefined`;

    return { msg, isOk };
};
