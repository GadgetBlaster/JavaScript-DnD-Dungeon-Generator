
/**
 * Result
 *
 * @typedef {Object} Result
 *
 * @property {string} msg
 * @property {boolean} isOk
 */

 /**
  * Empty elements
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

/** @type {Function} equals */
export const equals = (actual, expected) => {
    let isOk = expected === actual;
    let msg  = `expected "${actual}" to equal "${expected}"`;

    return { msg, isOk };
};

/** @type {Function} equalsArray */
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

/** @type {Function} equalsObject */
export const equalsObject = (actual, expected) => {
    let checkType = isObject(actual);

    if (!checkType.isOk) {
        return checkType;
    }

    let isOk = JSON.stringify(actual) === JSON.stringify(expected);
    let msg  = `expected object\n\n${JSON.stringify(actual, null, 1)}\n\nto equal\n\n${JSON.stringify(expected, null, 1)}`;

    return { msg, isOk };
};

/** @type {Function} isArray */
export const isArray = (value) => {
    let isOk = Array.isArray(value);
    let msg  = `expected "${value}" to be an array`;

    return { msg, isOk };
};

/** @type {Function} isBoolean */
export const isBoolean = (value) => {
    let isOk = typeof value === 'boolean';
    let msg  = `expected "${value}" to be boolean`;

    return { msg, isOk };
};

/** @type {Function} isFalse */
export const isFalse = (value) => {
    let isOk = value === false;
    let msg  = `expected "${value}" to be false`;

    return { msg, isOk };
};

/** @type {Function} isFunction */
export const isFunction = (value) => {
    let isOk = typeof value === 'function';
    let msg  = `expected "${value}" to be a function`;

    return { msg, isOk };
};

/** @type {Function} isHtmlTag */
export const isHtmlTag = (string, tag) => {
    let checkType = isString(string);

    if (!checkType.isOk) {
        return checkType;
    }

    let regExp  = new RegExp('^<'+tag+'(?:>| [^>]+>)', 'g');
    let isEmpty = emptyElements.includes(tag);
    let isOk    = regExp.test(string) && string.endsWith(isEmpty ? ' />' : `</${tag}>`);
    let msg     = `expected "${string}" to be an html tag string of ${isEmpty ? `<${tag} />` : `<${tag}>*</${tag}>`}`;

    return { msg, isOk };
};

/** @type {Function} isNull */
export const isNull = (value) => {
    let isOk = value === null;
    let msg  = `expected "${value}" to be a null`;

    return { msg, isOk };
};

/** @type {Function} isNumber */
export const isNumber = (value) => {
    let isOk = typeof value === 'number' && !isNaN(value);
    let msg  = `expected "${value}" to be a number`;

    return { msg, isOk };
};

/** @type {Function} isObject */
export const isObject = (value) => {
    let isOk = !!value && typeof value === 'object' && !Array.isArray(value);
    let msg  = `expected "${value}" to be an object`;

    return { msg, isOk };
};

/** @type {Function} isString */
export const isString = (value) => {
    let isOk = typeof value === 'string';
    let msg  = `expected "${value}" to be a string`;

    return { msg, isOk };
};

/** @type {Function} isTrue */
export const isTrue = (value) => {
    let isOk = value === true;
    let msg  = `expected "${value}" to be true`;

    return { msg, isOk };
};

/** @type {Function} isUndefined */
export const isUndefined = (value) => {
    let isOk = value === undefined;
    let msg  = `expected "${value}" to be undefined`;

    return { msg, isOk };
};

/** @type {Function} stringIncludes */
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

/** @type {Function} stringExcludes */
export const stringExcludes = (actual, excludes) => {
    let checkType = isString(actual);

    if (!checkType.isOk) {
        return checkType;
    }

    let { isOk, msg } = stringIncludes(actual, excludes);

    return { msg, isOk: !isOk };
};

/** @type {Function} throws */
export const throws = (func, expected) => {
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

    let isOk = errorMsg === expected;
    let msg  = `expected "${errorMsg}" to equal "${expected}"`;

    return { msg, isOk };
};
