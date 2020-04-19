
import { unit } from './run.js';

import {
    equals,
    isArray,
    isBoolean,
    isFalse,
    isNull,
    isNumber,
    isObject,
    isString,
    isTrue,
    isUndefined,
} from './assert.js';

/**
 * Output
 *
 * @type {string[]}
 */
let output = [];

/**
 * Describe
 *
 * @param {string} msg
 * @param {Function} callback
 */
export const describe = (msg, callback) => {
    output.push(msg);
    callback();
    output.pop();
};

/**
 * It
 *
 * @param {string} msg
 * @param {Function} callback
 */
export const it = (msg, callback) => {
    output.push(msg);
    callback();
    output.pop();
};

/**
 * Run assert
 *
 * @param {Function} assertion
 * @param {*} value
 * @param {*} expected
 */
const runAssert = (assertion, value, expected) => {
    let { msg, isOk } = assertion(value, expected);

    output.push(`${isOk ? 'Pass:' : 'Failure:'} ${msg}`);

    unit({
        isOk,
        msg: output.reduce((string, current, index) => {
            return `${string}${'    '.repeat(index)}${current}\n`;
        }, '')
    });

    output.pop();
};

/**
 * Assert
 *
 * @param {*} value
 *
 * @returns {Object.<string, Function>}
 */
export const assert = (value) => ({
    equals     : (expected) => runAssert(equals, value, expected),
    isArray    : () => runAssert(isArray, value),
    isBoolean  : () => runAssert(isBoolean, value),
    isFalse    : () => runAssert(isFalse, value),
    isNull     : () => runAssert(isNull, value),
    isNumber   : () => runAssert(isNumber, value),
    isObject   : () => runAssert(isObject, value),
    isString   : () => runAssert(isString, value),
    isTrue     : () => runAssert(isTrue, value),
    isUndefined: () => runAssert(isUndefined, value),
});
