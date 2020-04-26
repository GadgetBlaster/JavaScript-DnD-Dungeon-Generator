
import {
    equals,
    isArray,
    isBoolean,
    isFalse,
    isFunction,
    isNull,
    isNumber,
    isObject,
    isString,
    isTrue,
    isUndefined,
    stringContains,
    stringExcludes,
    throws,
} from './assert.js';

import { resultMsg } from './output.js';

/**
 * Summary
 *
 * @typedef {Object} Summary
 *
 * @property {Result[]} results
 * @property {number} assertions
 * @property {number} failures
 * @property {number} errors
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
 * @property {Function} runUnits
 */

/**
 * On assert
 *
 * @typedef {Function} OnAssert
 *
 * @param {Result} result
 */

/**
 * @param {Object} [config]
 *     @param {OnAssert} [config.onAssert]
 *
 * @return {Unit}
 */
export default ({ onAssert = () => {} } = {}) => {

    /**
     * Results
     *
     * @type {string[]}
     */
    let results = [];

    /**
     * Current
     *
     * @type {string[]}
     */
    let current = [];

    /**
     * Errors
     *
     * @type {string[]}
     */
    let errors = [];

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
        let result = assertion(actual, expected);
        let { msg, isOk } = result;

        assertions++;

        if (!isOk) {
            failures++;
        }

        current.push(`${isOk ? 'Pass:' : 'Failure:'} ${msg}`);

        onAssert(result);

        results.push({
            isOk,
            msg: resultMsg(current),
        });

        current.pop();

        return assert(actual);
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
        isFunction    : (expected) => _runAssert(value, expected, isFunction),
        isNull        : (expected) => _runAssert(value, expected, isNull),
        isNumber      : (expected) => _runAssert(value, expected, isNumber),
        isObject      : (expected) => _runAssert(value, expected, isObject),
        isString      : (expected) => _runAssert(value, expected, isString),
        isTrue        : (expected) => _runAssert(value, expected, isTrue),
        isUndefined   : (expected) => _runAssert(value, expected, isUndefined),
        stringContains: (expected) => _runAssert(value, expected, stringContains),
        stringExcludes: (expected) => _runAssert(value, expected, stringExcludes),
        throws        : (expected) => _runAssert(value, expected, throws),
    });

    /**
     * Utility
     *
     * @type {Utility}
     */
    const utility = {
        assert,
        describe,
        it,
    };

    /**
     * Run units
     *
     * @param {string} suite
     * @param {Function} tests
     */
    const runUnits = (suite, tests) => {
        current.push(suite);
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
            errors: [ ...errors ],
            failures,
            results: [ ...results ],
        };
    };

    /**
     * Get summary
     * TODO tests!
     *
     * @param {string} error
     */
    const onError = (error) => {
        errors.push({ isOk: false, msg: error });
    };

    return {
        getSummary,
        onError,
        runUnits,
    };
};
