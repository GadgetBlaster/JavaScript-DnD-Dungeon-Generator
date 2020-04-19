
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
 * Entry
 *
 * @typedef {Object} Entry
 *
 * @property {boolean} isOk
 * @property {string} msg
 */

/**
 * Summary
 *
 * @typedef {Object} Summary
 *
 * @property {Entry[]} summary
 * @property {number} assertions
 * @property {number} failures
 */

 /**
 * Utility
 *
 * @typedef {Object} Utility
 *
 * @property {Function} utility.assert
 * @property {Function} utility.describe
 * @property {Function} utility.it
 */

/**
 * Unit
 *
 * @typedef {Object} Unit
 *
 * @property {Function} getSummary
 * @property {Function} setPath
 * @property {Utility} utility
 */

/**
 * @param {Object} config
 *     @param {Function} config.onAssert
 *
 * @return {Unit}
 */
export default ({ onAssert }) => {

    /**
     * Summary
     *
     * @type {string[]}
     */
    let summary = [];

    /**
     * Current
     *
     * @type {string[]}
     */
    let current = [];

    /**
     * Assertions
     *
     * @type {number}
     */
    let assertions = 0;

    /**
     * Failures
     *
     * @type {number}
     */
    let failures = 0;

    /**
     * Describe
     *
     * @param {string} msg
     * @param {Function} callback
     */
    const describe = (msg, callback) => {
        current.push(msg);
        callback();
        current.pop();
    };

    /**
     * It
     *
     * @param {string} msg
     * @param {Function} callback
     */
    const it = (msg, callback) => {
        current.push(msg);
        callback();
        current.pop();
    };

    /**
     * Run assert
     *
     * @param {Function} assertion
     * @param {*} value
     * @param {*} expected
     */
    const _runAssert = (assertion, value, expected) => {
        let { msg, isOk } = assertion(value, expected);

        assertions++;

        if (!isOk) {
            failures++;
        }

        current.push(`${isOk ? 'Pass:' : 'Failure:'} ${msg}`);

        onAssert({ isOk });

        summary.push({
            isOk,
            msg: current.reduce((string, current, index) => {
                return `${string}${'    '.repeat(index)}${current}\n`;
            }, ''),
        });

        current.pop();
    };

    /**
     * Assert
     *
     * @param {*} value
     *
     * @returns {Object.<string, Function>}
     */
    const assert = (value) => ({
        equals     : (expected) => _runAssert(equals, value, expected),
        isArray    : () => _runAssert(isArray, value),
        isBoolean  : () => _runAssert(isBoolean, value),
        isFalse    : () => _runAssert(isFalse, value),
        isNull     : () => _runAssert(isNull, value),
        isNumber   : () => _runAssert(isNumber, value),
        isObject   : () => _runAssert(isObject, value),
        isString   : () => _runAssert(isString, value),
        isTrue     : () => _runAssert(isTrue, value),
        isUndefined: () => _runAssert(isUndefined, value),
    });

    /**
     * Utility
     *
     * @type {Utility}
     */
    const utility = {
        assert,
        describe,
        it
    };

    /**
     * Run tests
     */
    const runTests = (path, tests) => {
        current.push(path);
        tests(utility);
        current.pop();
    };

    /**
     * Get summary
     *
     * @returns {Summary}
     */
    const getSummary = () => {
        return {
            assertions,
            failures,
            summary: [ ...summary ],
        };
    };

    return {
        getSummary,
        runTests,
    };
}
