// @ts-check

import * as assertFunctions from './assert.js';
import { getErrorMessage } from '../utility/tools.js';
import { getResultMessage } from './output.js';

// -- Types --------------------------------------------------------------------

/** @typedef {import('./assert.js').Result} Result */

/** @typedef {(value?: any) => Assertions} Assertion */

/**
 * @typedef {object} Assertions
 *
 * @prop {Assertion} equals
 * @prop {Assertion} equalsArray
 * @prop {Assertion} equalsObject
 * @prop {Assertion} excludesAttributes
 * @prop {Assertion} hasAttributes
 * @prop {Assertion} hasTextContent
 * @prop {Assertion} isArray
 * @prop {Assertion} isBoolean
 * @prop {Assertion} isElementTag
 * @prop {Assertion} isFalse
 * @prop {Assertion} isFunction
 * @prop {Assertion} isInArray
 * @prop {Assertion} isNull
 * @prop {Assertion} isNumber
 * @prop {Assertion} isObject
 * @prop {Assertion} isSet
 * @prop {Assertion} isString
 * @prop {Assertion} isTrue
 * @prop {Assertion} isUndefined
 * @prop {Assertion} stringExcludes
 * @prop {Assertion} stringIncludes
 * @prop {Assertion} throws
*/

/** @typedef {{ scope: Scope; msg: string }} CurrentScope */

/**
 * @typedef {object} Entry
 *
 * @prop {string} msg
 * @prop {boolean} isOk
 */

/** @typedef {"assert()" | "describe()" | "it()" | "default()"} Scope */

/**
 * @typedef {object} State
 *
 * @prop {() => Summary} getSummary
 * @prop {(error: string) => void} onError
 * @prop {(path: string, tests: (utility: Utility) => void) => void} runUnits
 */

/**
 * @typedef {object} Summary
 *
 * @prop {number} assertions
 * @prop {number} errors
 * @prop {number} failures
 * @prop {Result[]} results
 */

/**
 * @typedef {object} Utility
 *
 * @prop {(value: any) => Assertions} assert
 * @prop {(msg: string, callback: () => void) => void} describe
 * @prop {(msg: string, callback: () => void) => void} it
 */

// -- Config -------------------------------------------------------------------

/** @type {{ [key: string]: Scope }} */
const scope = {
    assert  : 'assert()',
    describe: 'describe()',
    it      : 'it()',
    suite   : 'default()',
};

// -- Public Functions ---------------------------------------------------------

/**
 * Creates a closure containing unit test state: assertions, errors, and
 * failures. Returns an object of unit test operations.
 *
 * @returns {State}
 */
export function unitState() {

    /**
     * Assertions
     *
     * @type {number}
     */
    let assertions = 0;

    /**
     * Current
     *
     * @type {CurrentScope[]}
     */
    let current = [];

    /**
     * Errors
     *
     * @type {number}
     */
    let errors = 0;

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
     * @param {string[]} allowed
     *
     * @throws
     */
    const checkScope = (nextScope, allowed) => {
        let currentEntry = current[current.length - 1];
        let currentScope = currentEntry.scope;

        if (!allowed.includes(currentScope)) {
            throw new TypeError(`${nextScope} must be called inside of ${allowed.join(' or ')}`);
        }
    };

    /**
     * Describe
     *
     * @param {string} msg
     * @param {() => void} callback
     */
    const describe = (msg, callback) => {
        checkScope(scope.describe, [ scope.suite, scope.describe ]);

        current.push({ scope: scope.describe, msg });
        runCallback(callback);
        current.pop();
    };

    /**
     * It
     *
     * @param {string} msg
     * @param {() => void} callback
     */
    const it = (msg, callback) => {
        checkScope(scope.it, [ scope.describe ]);

        current.push({ scope: scope.it, msg });
        runCallback(callback);
        current.pop();
    };

    /**
     * Run assertion
     *
     * @param {*} actual
     * @param {*} expected
     * @param {(actual: any, expected: any) => Result} assertion
     *
     * @returns {{ [key: string]: Assertion }}
     */
    const runAssertion = (actual, expected, assertion) => {
        checkScope(scope.assert, [ scope.it ]);

        let result = assertion(actual, expected);
        let { msg, isOk } = result;

        assertions++;

        if (!isOk) {
            failures++;
        }

        current.push({
            scope: scope.assert,
            msg: `${isOk ? 'Pass:' : 'Failure:'} ${msg}`,
        });

        results.push({
            isOk,
            msg: getResultMessage(current),
        });

        current.pop();

        return assert(actual);
    };

    /**
     * Assert
     *
     * @param {any} value
     *
     * @returns {ReturnType<Assertions>}
     */
    const assert = (value) => Object.entries(assertFunctions).reduce((assertObj, [ key, assertion ]) => {
        assertObj[key] = (expected) => runAssertion(value, expected, assertion);
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
     * Runs a callback function, it() or describe(), inside a try/catch block,
     * adding any errors to the results output.
     *
     * @param {() => void} callback
     */
    const runCallback = (callback) => {
        try {
            callback();
        } catch (error) {
            onError(getErrorMessage(error));
        }
    };

    /**
     * Run units
     *
     * @param {string} path
     * @param {(utility: Utility) => void} tests
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
            errors,
            failures,
            results: [ ...results ],
        };
    };

    /**
     * Get summary
     *
     * @param {string} msg
     */
    const onError = (msg) => {
        errors++;
        results.push({ isOk: false, msg });
    };

    return {
        getSummary,
        onError,
        runUnits,
    };
}
