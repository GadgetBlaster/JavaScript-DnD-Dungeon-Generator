
import * as assertFunctions from './assert.js';
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
 * @typedef {(expected:*) => Assertions} Expectation
 */

/**
 * Assertions
 *
 * @typedef {Object} Assertions
 *
 * @property {Expectation} equals
 * @property {Expectation} equalsArray
 * @property {Expectation} equalsObject
 * @property {Expectation} isArray
 * @property {Expectation} isBoolean
 * @property {Expectation} isFalse
 * @property {Expectation} isFunction
 * @property {Expectation} isHtmlTag
 * @property {Expectation} isNull
 * @property {Expectation} isNumber
 * @property {Expectation} isObject
 * @property {Expectation} isString
 * @property {Expectation} isTrue
 * @property {Expectation} isUndefined
 * @property {Expectation} stringExcludes
 * @property {Expectation} stringIncludes
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
 * Entry
 *
 * @typedef {Object} Entry
 *
 * @property {string} msg
 * @property {boolean} isOk
 */

/**
 * Result
 *
 * @typedef {import('./assert.js').Result}
 */

/**
 * Scope
 *
 * @type {Object<string, string>}
 */
const scope = {
    assert  : 'assert()',
    describe: 'describe()',
    it      : 'it()',
    suite   : 'default()',
};

/**
 * @type {Unit}
 */
export default () => {

    /**
     * Assertions
     *
     * @type {number}
     */
    let assertions = 0;

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
     * Failures
     *
     * @type {number}
     */
    let failures = 0;

    /**
     * Results
     *
     * @type {Result[]}
     */
    let results = [];

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
            throw new TypeError('No test entries');
        }

        let currentScope = currentEntry.scope;

        if (!allowed.includes(currentScope)) {
            throw new TypeError(`${nextScope} must be called inside of ${allowed.join(' or ')}`);
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
    const runAssert = (actual, expected, assertion) => {
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
    const assert = (value) => Object.entries(assertFunctions).reduce((assertObj, [ key, assertion ]) => {
        assertObj[key] = (expected) => runAssert(value, expected, assertion);
        return assertObj;
    }, {});

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
     * @param {string} path
     * @param {Function} tests
     */
    const runUnits = (path, tests) => {
        current.push({ scope: scope.suite, msg: path });
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

        results.push(result);
        errors.push(result);
    };

    return {
        getSummary,
        onError,
        runUnits,
    };
};
