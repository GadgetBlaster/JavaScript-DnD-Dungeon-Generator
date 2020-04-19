
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
    stringContains,
} from './assert.js';

/**
 * Summary
 *
 * @typedef {Object} Summary
 *
 * @property {Result[]} log
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
     * Log
     *
     * @type {string[]}
     */
    let log = [];

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
     * @param {*} actual
     * @param {*} expected
     * @param {Function} assertion
     *
     * @returns {Object.<string, Function>}
     */
    const _runAssert = (actual, expected, assertion) => {
        let { msg, isOk } = assertion(actual, expected);

        assertions++;

        if (!isOk) {
            failures++;
        }

        current.push(`${isOk ? 'Pass:' : 'Failure:'} ${msg}`);

        onAssert({ isOk });

        log.push({
            isOk,
            msg: current.reduce((string, current, index) => {
                return `${string}${'    '.repeat(index)}${current}\n`;
            }, ''),
        });

        current.pop();

        return assert(actual, expected);
    };

    /**
     * Assert
     *
     * @param {*} value
     *
     * @returns {Object.<string, Function>}
     */
    const assert = (value) => ({
        equals        : (expected) => _runAssert(value, expected, equals),
        isArray       : (expected) => _runAssert(value, expected, isArray),
        isBoolean     : (expected) => _runAssert(value, expected, isBoolean),
        isFalse       : (expected) => _runAssert(value, expected, isFalse),
        isNull        : (expected) => _runAssert(value, expected, isNull),
        isNumber      : (expected) => _runAssert(value, expected, isNumber),
        isObject      : (expected) => _runAssert(value, expected, isObject),
        isString      : (expected) => _runAssert(value, expected, isString),
        isTrue        : (expected) => _runAssert(value, expected, isTrue),
        isUndefined   : (expected) => _runAssert(value, expected, isUndefined),
        stringContains: (expected) => _runAssert(value, expected, stringContains),
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
            log: [ ...log ],
        };
    };

    return {
        getSummary,
        runTests,
    };
}
