
/**
 * Result
 *
 * @typedef {Object} Result
 *
 * @property {string} msg
 * @property {boolean} isOk
 */

/**
 * Assertion
 *
 * @typedef {Function} Assertion
 *
 * @param {*} actual
 * @param {*} expected
 *
 * @returns {Result}
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
    let msg  = `expected [ ${value} ] to be an array`;

    return { msg, isOk };
};

/** @type {Assertion} isBoolean */
export const isBoolean = (value) => {
    let isOk = typeof value === 'boolean';
    let msg  = `expected [ ${value} ] to be a boolean`;

    return { msg, isOk };
};

/** @type {Assertion} isFalse */
export const isFalse = (value) => {
    let isOk = value === false;
    let msg  = `expected [ ${value} ] to be false`;

    return { msg, isOk };
};

/** @type {Assertion} isFunction */
export const isFunction = (value) => {
    let isOk = typeof value === 'function';
    let msg  = `expected [ ${value} ] to be a function`;

    return { msg, isOk };
};

/** @type {Assertion} isNull */
export const isNull = (value) => {
    let isOk = value === null;
    let msg  = `expected [ ${value} ] to be a null`;

    return { msg, isOk };
};

/** @type {Assertion} isNumber */
export const isNumber = (value) => {
    let isOk = typeof value === 'number' && !isNaN(value);
    let msg  = `expected [ ${value} ] to be a number`;

    return { msg, isOk };
};

/** @type {Assertion} isObject */
export const isObject = (value) => {
    let isOk = !!value && typeof value === 'object' && !Array.isArray(value);
    let msg  = `expected [ ${value} ] to be an object`;

    return { msg, isOk };
};

/** @type {Assertion} isString */
export const isString = (value) => {
    let isOk = typeof value === 'string';
    let msg  = `expected [ ${value} ] to be a string`;

    return { msg, isOk };
};

/** @type {Assertion} isTrue */
export const isTrue = (value) => {
    let isOk = value === true;
    let msg  = `expected [ ${value} ] to be true`;

    return { msg, isOk };
};

/** @type {Assertion} isUndefined */
export const isUndefined = (value) => {
    let isOk = value === undefined;
    let msg  = `expected [ ${value} ] to be undefined`;

    return { msg, isOk };
};

/** @type {Assertion} stringContains */
export const stringContains = (actual, expected) => {
    let checkType = isString(actual);

    if (!checkType.isOk) {
        return checkType;
    }

    let isOk = actual.includes(expected);
    let msg  = `expected [ ${actual} ] to contain [ ${expected} ]`;

    return { msg, isOk };
};

/** @type {Assertion} stringExcludes */
export const stringExcludes = (actual, expected) => {
    let checkType = isString(actual);

    if (!checkType.isOk) {
        return checkType;
    }

    let { isOk, msg } = stringContains(actual, expected);
    return { msg, isOk: !isOk };
};

/** @type {Assertion} throws */
export const throws = (func) => {
    let checkFunc = isFunction(func);

    if (!checkFunc.isOk) {
        return checkFunc;
    }

    let threw = false;

    try {
        func();
    } catch(e) {
        threw = true;
    }

    let msg  = `expected [ ${func.name} ] to throw`;

    return { msg, isOk: threw };
};
