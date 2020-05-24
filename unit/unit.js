
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
 * @property {number} assertions
 * @property {number} failures
 * @property {Result[]} results
 * @property {string[]} errors
 */

/**
 * Expectation
 *
 * @typedef {(value:*) => Assertions} Expectation
 */

/**
 * Assertions
 *
 * @typedef {Object} Assertions
 *
 * @property {Expectation} equals
 * @property {Expectation} isArray
 * @property {Expectation} isBoolean
 * @property {Expectation} isFalse
 * @property {Expectation} isFunction
 * @property {Expectation} isNull
 * @property {Expectation} isNumber
 * @property {Expectation} isObject
 * @property {Expectation} isString
 * @property {Expectation} isTrue
 * @property {Expectation} isUndefined
 * @property {Expectation} stringContains
 * @property {Expectation} stringExcludes
 * @property {Expectation} throws
 */

/**
 * Utility
 *
 * @typedef {Object} Utility
 *
 * @property {(value:*) => Assertions} utility.assert
 * @property {Function} utility.describe
 * @property {Function} utility.it
 */

/**
 * Unit
 *
 * @typedef {Object} Unit
 *
 * @property {() => Summary} getSummary
 * @property {Function} runUnits
 * @property {onError} onError
 */

/**
 * On assert
 *
 * @typedef {Function} OnAssert
 *
 * @param {Result} result
 */

/**
 * Entry
 *
 * @typedef {Object} Entry
 *
 * @property {string} msg
 * @property {boolean} isOk
 */

/**
 * Scope
 *
 * @type {Object.<string, string>}
 */
const scope = {
    assert  : 'assert',
    describe: 'describe',
    it      : 'it',
    suite   : 'suite',
};

/**
 * @param {Object} [config]
 *     @param {OnAssert} [config.onAssert]
 *
 * @type {Unit}
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
     * @type {Entry[]}
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
     * Check scope
     *
     * @param {string} nextScope
     * @param {string[] array
     *
     * @throws
     */
    const checkScope = (nextScope, allowed) => {
        let currentEntry = current[current.length -1];

        if (!currentEntry) {
            throw new Error('No test entries');
        }

        let currentScope = currentEntry.scope;

        if (!allowed.includes(currentScope)) {
            throw new Error(`${nextScope} cannot be called inside ${currentScope}`);
        }
    };

    /**
     * Describe
     *
     * @param {string} msg
     * @param {Function} callback
     */
    const describe = (msg, callback) => {
        checkScope(scope.describe, [ scope.suite, scope.describe ]);

        current.push({ scope: scope.describe, msg });
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
        checkScope(scope.it, [ scope.describe ]);

        current.push({ scope: scope.it, msg });
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
     * @returns {Assertions}
     */
    const _runAssert = (actual, expected, assertion) => {
        checkScope(scope.assert, [ scope.it ]);

        let result = assertion(actual, expected);
        let { msg, isOk } = result;

        assertions++;

        if (!isOk) {
            failures++;
        }

        current.push({
            scope: scope.assert,
            msg: `${isOk ? 'Pass:' : 'Failure:'} ${msg}`
        });

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
     * @returns {Assertions}
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
        current.push({ scope: scope.suite, msg: suite });
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
     *
     * @param {string} error
     */
    const onError = (error) => {
        let result = { isOk: false, msg: error };

        onAssert(result);
        errors.push(result);
    };

    return {
        getSummary,
        onError,
        runUnits,
    };
};
