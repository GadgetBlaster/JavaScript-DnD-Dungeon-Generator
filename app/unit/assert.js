
/**
 * Result
 *
 * @typedef {Object} Result
 *
 * @property {string} msg
 * @property {boolean} isOk
 */

// -- Config -------------------------------------------------------------------

 /**
  * Empty elements
  *
  * TODO rename to `selfClosingElements`
  *
  * @type {string[]}
  */
const emptyElements = [
    'area',
    'base',
    'br',
    'col',
    'embed',
    'hr',
    'img',
    'input',
    'link',
    'meta',
    'param',
    'source',
    'track',
    'wbr',
];

// -- Public Functions ---------------------------------------------------------

/** @type {(actual: *, expected: *) => Result} equals */
export const equals = (actual, expected) => {
    let isOk = expected === actual;
    let msg  = `expected "${actual}" to equal "${expected}"`;

    return { msg, isOk };
};

/** @type {(actual: *, expected: *) => Result} equalsArray */
export const equalsArray = (actual, expected) => {
    let checkType = isArray(actual);

    if (!checkType.isOk) {
        return checkType;
    }

    if (actual.length !== expected.length) {
        return {
            msg: `expected array length of ${actual.length} to be ${expected.length}`,
            isOk: false,
        };
    }

    let msg  = `expected [ ${actual.join(', ')} ] to equal [ ${expected.join(', ')} ]`;
    let isOk = actual.filter((a, i) => a === expected[i]).length === actual.length;

    return { msg, isOk };
};

/** @type {(actual: *, expected: *) => Result} equalsObject */
export const equalsObject = (actual, expected) => {
    let checkType = isObject(actual);

    if (!checkType.isOk) {
        return checkType;
    }

    let isOk = JSON.stringify(actual) === JSON.stringify(expected);
    let msg  = `expected object\n\n${JSON.stringify(actual, null, 1)}\n\nto equal\n\n${JSON.stringify(expected, null, 1)}`;

    return { msg, isOk };
};

/** @type {(value: *) => Result} isArray */
export const isArray = (value) => {
    let isOk = Array.isArray(value);
    let msg  = `expected "${value}" to be an array`;

    return { msg, isOk };
};

/** @type {(value: *) => Result} isBoolean */
export const isBoolean = (value) => {
    let isOk = typeof value === 'boolean';
    let msg  = `expected "${value}" to be boolean`;

    return { msg, isOk };
};

/** @type {(value: *) => Result} isFalse */
export const isFalse = (value) => {
    let isOk = value === false;
    let msg  = `expected "${value}" to be false`;

    return { msg, isOk };
};

/** @type {(value: *) => Result} isFunction */
export const isFunction = (value) => {
    let isOk = typeof value === 'function';
    let msg  = `expected "${value}" to be a function`;

    return { msg, isOk };
};

/** @type {(value: *, tag: string) => Result} isHtmlTag */
export const isHtmlTag = (value, tag) => {
    let checkType = isString(value);

    if (!checkType.isOk) {
        return checkType;
    }

    let regExp  = new RegExp('^<'+tag+'(?:>| [^>]+>)', 'g');
    let isEmpty = emptyElements.includes(tag);
    let isOk    = regExp.test(value) && value.endsWith(isEmpty ? ' />' : `</${tag}>`);
    let msg     = `expected "${value}" to be an html tag string of ${isEmpty ? `<${tag} />` : `<${tag}>*</${tag}>`}`;

    return { msg, isOk };
};

/** @type {(value: *) => Result} isNull */
export const isNull = (value) => {
    let isOk = value === null;
    let msg  = `expected "${value}" to be a null`;

    return { msg, isOk };
};

/** @type {(value: *) => Result} isNumber */
export const isNumber = (value) => {
    let isOk = typeof value === 'number' && !isNaN(value);
    let msg  = `expected "${value}" to be a number`;

    return { msg, isOk };
};

/** @type {(value: *) => Result} isObject */
export const isObject = (value) => {
    let isOk = !!value && typeof value === 'object' && !Array.isArray(value);
    let msg  = `expected "${value}" to be an object`;

    return { msg, isOk };
};

/** @type {(value: *) => Result} isString */
export const isString = (value) => {
    let isOk = typeof value === 'string';
    let msg  = `expected "${value}" to be a string`;

    return { msg, isOk };
};

/** @type {(value: *) => Result} isTrue */
export const isTrue = (value) => {
    let isOk = value === true;
    let msg  = `expected "${value}" to be true`;

    return { msg, isOk };
};

/** @type {(value: *) => Result} isUndefined */
export const isUndefined = (value) => {
    let isOk = value === undefined;
    let msg  = `expected "${value}" to be undefined`;

    return { msg, isOk };
};

/** @type {(actual: *, includes: string) => Result} stringIncludes */
export const stringIncludes = (actual, includes) => {
    let checkType = isString(actual);

    if (!checkType.isOk) {
        return checkType;
    }

    if (includes === '') {
        throw new TypeError('Invalid empty string expected in `stringIncludes`');
    }

    let isOk = actual.includes(includes);
    let msg  = `expected "${actual}" to include "${includes}"`;

    return { msg, isOk };
};

/** @type {(actual: *, excludes: *) => Result} stringExcludes */
export const stringExcludes = (actual, excludes) => {
    let checkType = isString(actual);

    if (!checkType.isOk) {
        return checkType;
    }

    let { isOk, msg } = stringIncludes(actual, excludes);

    return { msg, isOk: !isOk };
};

/** @type {(function: *, expectedErrorMsg: string) => Result} throws */
export const throws = (func, expectedErrorMsg) => {
    let checkFunc = isFunction(func);

    if (!checkFunc.isOk) {
        return checkFunc;
    }

    let errorMsg;

    try {
        func();
    } catch(e) {
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
};
