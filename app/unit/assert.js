// @ts-check

import { selfClosingElements } from '../utility/element.js';

// -- Types --------------------------------------------------------------------

/**
 * Result
 *
 * @typedef {Object} Result
 *
 * @property {string} msg
 * @property {boolean} isOk
 */

// -- Public Functions ---------------------------------------------------------

/** @type {(value: any, expected: any) => Result} equals */
export function equals(value, expected) {
    let isOk = expected === value;
    let msg  = `expected "${value}" to equal "${expected}"`;

    return { msg, isOk };
}

/** @type {(value: any, expected: any[]) => Result} equalsArray */
export function equalsArray(value, expected) {
    let checkType = isArray(value);

    if (!checkType.isOk) {
        return checkType;
    }

    if (value.length !== expected.length) {
        return {
            msg: `expected array length of ${value.length} to be ${expected.length}`,
            isOk: false,
        };
    }

    let msg  = `expected [ ${value.join(', ')} ] to equal [ ${expected.join(', ')} ]`;
    let isOk = value.filter((a, i) => a === expected[i]).length === value.length;

    return { msg, isOk };
}

/** @type {(value: any, expected: object) => Result} equalsObject */
export function equalsObject(value, expected) {
    let checkType = isObject(value);

    if (!checkType.isOk) {
        return checkType;
    }

    let valueString    = JSON.stringify(value, null, 1);
    let expectedString = JSON.stringify(expected, null, 1);

    let isOk = JSON.stringify(value) === JSON.stringify(expected);
    let msg  = `expected object\n\n${valueString}\n\nto equal\n\n${expectedString}`;

    return { msg, isOk };
}

/** @type {(value: any) => Result} isArray */
export function isArray(value) {
    let isOk = Array.isArray(value);
    let msg  = `expected "${value}" to be an array`;

    return { msg, isOk };
}

/** @type {(value: any) => Result} isBoolean */
export function isBoolean(value) {
    let isOk = typeof value === 'boolean';
    let msg  = `expected "${value}" to be boolean`;

    return { msg, isOk };
}

/** @type {(value: any, tag: string) => Result} isElementTag */
export function isElementTag(value, tag) {
    let checkType = isString(value);

    if (!checkType.isOk) {
        return checkType;
    }

    let regExp  = new RegExp('^<'+tag+'(?:>| [^>]+>)', 'g');
    let isEmpty = selfClosingElements.includes(tag);
    let isTag   = regExp.test(value) && value.endsWith(isEmpty ? ' />' : `</${tag}>`);
    let msg     = `expected "${value}" to be an element tag string of ${isEmpty ? `<${tag} />` : `<${tag}>*</${tag}>`}`;

    if (!isTag) {
        return { msg, isOk: false };
    }

    let brackets = isEmpty ? 1 : 2;
    let isSingleTag = value.match(/</g).length === brackets && value.match(/>/g).length === brackets;

    return { msg, isOk: isSingleTag };
}

/** @type {(value: any) => Result} isFalse */
export function isFalse(value) {
    let isOk = value === false;
    let msg  = `expected "${value}" to be false`;

    return { msg, isOk };
}

/** @type {(value: any) => Result} isFunction */
export function isFunction(value) {
    let isOk = typeof value === 'function';
    let msg  = `expected "${value}" to be a function`;

    return { msg, isOk };
}

/** @type {(value: any) => Result} isNull */
export function isNull(value) {
    let isOk = value === null;
    let msg  = `expected "${value}" to be a null`;

    return { msg, isOk };
}

/** @type {(value: any) => Result} isNumber */
export function isNumber(value) {
    let isOk = typeof value === 'number' && !isNaN(value);
    let msg  = `expected "${value}" to be a number`;

    return { msg, isOk };
}

/** @type {(value: any) => Result} isObject */
export function isObject(value) {
    let isOk = !!value && typeof value === 'object' && !Array.isArray(value);
    let msg  = `expected "${value}" to be an object`;

    return { msg, isOk };
}

/** @type {(value: any) => Result} isString */
export function isString(value) {
    let isOk = typeof value === 'string';
    let msg  = `expected "${value}" to be a string`;

    return { msg, isOk };
}

/** @type {(value: any) => Result} isTrue */
export function isTrue(value) {
    let isOk = value === true;
    let msg  = `expected "${value}" to be true`;

    return { msg, isOk };
}

/** @type {(value: any) => Result} isUndefined */
export function isUndefined(value) {
    let isOk = value === undefined;
    let msg  = `expected "${value}" to be undefined`;

    return { msg, isOk };
}

/** @type {(value: any, includes: string) => Result} stringIncludes */
export function stringIncludes(value, includes) {
    let checkType = isString(value);

    if (!checkType.isOk) {
        return checkType;
    }

    if (includes === '') {
        throw new TypeError('Invalid empty string expected in `stringIncludes`');
    }

    let isOk = value.includes(includes);
    let msg  = `expected "${value}" to include "${includes}"`;

    return { msg, isOk };
}

/** @type {(value: any, excludes: string) => Result} stringExcludes */
export function stringExcludes(value, excludes) {
    let checkType = isString(value);

    if (!checkType.isOk) {
        return checkType;
    }

    let { isOk, msg } = stringIncludes(value, excludes);

    return { msg, isOk: !isOk };
}

/** @type {(func: any, expectedErrorMsg: string) => Result} throws */
export function throws(func, expectedErrorMsg) {
    let checkFunc = isFunction(func);

    if (!checkFunc.isOk) {
        return checkFunc;
    }

    let errorMsg;

    try {
        func();
    } catch (e) {
        errorMsg = e.message;
    }

    if (!errorMsg) {
        return {
            isOk: false,
            msg: `expected function "${func.name}" to throw`,
        };
    }

    let isOk = errorMsg === expectedErrorMsg;
    let msg  = `expected "${errorMsg}" to equal "${expectedErrorMsg}"`;

    return { msg, isOk };
}
