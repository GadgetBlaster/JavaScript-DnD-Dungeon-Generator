// @ts-check

import { selfClosingElements } from '../utility/element.js';

// -- Type Imports -------------------------------------------------------------

/** @typedef {import('../utility/element.js').Attributes} Attributes */

// -- Types --------------------------------------------------------------------

/**
 * @typedef {Object} Result
 *
 * @prop {string} msg
 * @prop {boolean} isOk
 */

// -- Private Functions --------------------------------------------------------

/**
 * @param {any} element
 *
 * @returns {Result}
 */
function isElement(element) {
    let msg = `expected "${element}" to be an Element`;

    if (element instanceof Element) {
        return { msg, isOk: true };
    }

    return { msg, isOk: false };
}

export { isElement as testIsElement };

// -- Public Functions ---------------------------------------------------------

/**
 * @param {any} value
 * @param {string | number | boolean} expected
 *
 * @returns {Result}
 */
export function equals(value, expected) {
    let isOk = value === expected;
    let msg  = `expected "${value}" to equal "${expected}"`;

    if (!isOk && value == expected) {
        msg  = `expected "${value}" (${typeof value}) to equal "${expected}" (${typeof expected})`;
    }

    return { msg, isOk };
}

/**
 * @param {any} value
 * @param {any[]} expected
 *
 * @returns {Result}
 */
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

    let valueString    = JSON.stringify(value, null, 1);
    let expectedString = JSON.stringify(expected, null, 1);

    let isOk = JSON.stringify(value) === JSON.stringify(expected);
    let msg  = `expected array\n\n${valueString}\n\nto equal\n\n${expectedString}`;

    return { msg, isOk };
}

/**
 * @param {any} value
 * @param {object} expected
 *
 * @returns {Result}
 */
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

/**
 * @param {any} element
 * @param {string[]} attributes
 *
 * @returns {Result}
 */
export function excludesAttributes(element, attributes) {
    let checkElType = isElement(element);

    if (!checkElType.isOk) {
        return checkElType;
    }

    let checkAttrsType = isArray(attributes);

    if (!checkAttrsType.isOk) {
        return checkAttrsType;
    }

    let isOk = true;
    let msgs = [];

    attributes.forEach((attr) => {
        let result = isNull(element.getAttribute(attr));

        msgs.push(result.msg);

        if (!result.isOk) {
            isOk = false;
        }
    });

    return {
        isOk,
        msg: msgs.join(', '),
    };
}

/**
 * @param {any} element
 * @param {Attributes} attributes
 *
 * @returns {Result}
 */
export function hasAttributes(element, attributes) {
    let checkElType = isElement(element);

    if (!checkElType.isOk) {
        return checkElType;
    }

    let checkAttrsType = isObject(attributes);

    if (!checkAttrsType.isOk) {
        return checkAttrsType;
    }

    let isOk = true;
    let msgs = [];

    Object.entries(attributes).forEach(([ attr, value ]) => {
        let result = equals(element.getAttribute(attr), value);

        msgs.push(result.msg);

        if (!result.isOk) {
            isOk = false;
        }
    });

    return {
        isOk,
        msg: msgs.join(', '),
    };
}

/**
 * @param {any} element
 * @param {string} includes
 *
 * @returns {Result}
 */
export function hasTextContent(element, includes) {
    let checkElType = isElement(element);

    if (!checkElType.isOk) {
        return checkElType;
    }

    let isOk = element.textContent.includes(includes);
    let msg  = `expected "${element.textContent}" to include "${includes}"`;

    return { msg, isOk };
}

/**
 * @param {any} value
 *
 * @returns {Result}
 */
export function isArray(value) {
    let isOk = Array.isArray(value);
    let msg  = `expected "${value}" to be an array`;

    return { msg, isOk };
}

/**
 * @param {any} value
 *
 * @returns {Result}
 */
export function isBoolean(value) {
    let isOk = typeof value === 'boolean';
    let msg  = `expected "${value}" to be boolean`;

    return { msg, isOk };
}

/**
 * @param {any} element
 * @param {string} tag
 *
 * @returns {Result}
 */
export function isElementTag(element, tag) {
    let checkElType = isElement(element);

    if (!checkElType.isOk) {
        return checkElType;
    }

    let isOk = element.tagName === tag || element.tagName === tag.toUpperCase();
    let msg  = `expected "${element.tagName}" to have a tag name of "${tag}"`;

    return { msg, isOk: isOk };
}

/**
 * @param {any} value
 *
 * @returns {Result}
 */
export function isFalse(value) {
    let isOk = value === false;
    let msg  = `expected "${value}" to be false`;

    return { msg, isOk };
}

/**
 * @param {any} value
 *
 * @returns {Result}
 */
export function isFunction(value) {
    let isOk = typeof value === 'function';
    let msg  = `expected "${value}" to be a function`;

    return { msg, isOk };
}

/**
* @param {any} value
* @param {any[]} array
*
* @returns {Result}
*/
export function isInArray(value, array) {
    let checkType = isArray(array);

    if (!checkType.isOk) {
        return checkType;
    }

    let isOk = array.includes(value);
    let msg  = `expected "${value}" to be included in ${JSON.stringify(array)}`;

    return { msg, isOk };
}

/**
 * @param {any} value
 *
 * @returns {Result}
 */
export function isNull(value) {
    let isOk = value === null;
    let msg  = `expected "${value}" to be a null`;

    return { msg, isOk };
}

/**
 * @param {any} value
 *
 * @returns {Result}
 */
export function isNumber(value) {
    let isOk = typeof value === 'number' && !isNaN(value);
    let msg  = `expected "${value}" to be a number`;

    return { msg, isOk };
}

/**
 * @param {any} value
 *
 * @returns {Result}
 */
export function isObject(value) {
    let isOk = Boolean(value)
        && typeof value === 'object'
        && !Array.isArray(value)
        && !(value instanceof Element)
        && !(value instanceof Set);

    let msg  = `expected "${value}" to be an object`;

    return { msg, isOk };
}

/**
 * @param {any} value
 *
 * @returns {Result}
 */
export function isSet(value) {
    let isOk = value instanceof Set;
    let msg  = `expected "${value}" to be a Set`;

    return { msg, isOk };
}

/**
 * @param {any} value
 *
 * @returns {Result}
 */
export function isString(value) {
    let isOk = typeof value === 'string';
    let msg  = `expected "${value}" to be a string`;

    return { msg, isOk };
}

/**
 * @param {any} value
 *
 * @returns {Result}
 */
export function isTrue(value) {
    let isOk = value === true;
    let msg  = `expected "${value}" to be true`;

    return { msg, isOk };
}

/**
 * @param {any} value
 *
 * @returns {Result}
 */
export function isUndefined(value) {
    let isOk = value === undefined;
    let msg  = `expected "${value}" to be undefined`;

    return { msg, isOk };
}

/**
 * @throws
 *
 * @param {any} value
 * @param {string} includes
 *
 * @returns {Result}
 */
export function stringIncludes(value, includes) {
    let checkType = isString(value);

    if (!checkType.isOk) {
        return checkType;
    }

    if (includes === '') {
        throw new TypeError('Invalid empty string expected in stringIncludes()');
    }

    let isOk = value.includes(includes);
    let msg  = `expected "${value}" to include "${includes}"`;

    return { msg, isOk };
}

/**
 * @throws
 *
 * @param {any} value
 * @param {string} excludes
 *
 * @returns {Result}
 */
export function stringExcludes(value, excludes) {
    let checkType = isString(value);

    if (!checkType.isOk) {
        return checkType;
    }

    let { isOk, msg } = stringIncludes(value, excludes);

    return { msg, isOk: !isOk };
}

/**
 * @param {() => any} func
 * @param {string} expectedErrorMsg
 *
 * @returns {Result}
 */
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
            msg: 'expected function to throw',
        };
    }

    let isOk = errorMsg === expectedErrorMsg;
    let msg  = `expected "${errorMsg}" to equal "${expectedErrorMsg}"`;

    return { msg, isOk };
}
