
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
} from '../assert.js';

/**
 * Assertions
 *
 * @type {Function[]}
 */
const assertions = [
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
];

/**
 * Groups
 *
 * @type {Object}
 */
const groups = {
    array: {
        'an array': [ 'array' ],
        'an empty array': [],
    },
    boolean: {
        '`false`': false,
        '`true`': true,
    },
    function: {
        'a function': () => {},
        'a function that throws': () => { throw new Error('Junk'); },
    },
    null: {
        '`null`': null,
    },
    number: {
        'a float': 3.14159,
        'infinity': Infinity,
        'the integer `-1`': -1,
        'the integer `0`': 0,
        'the integer `1`': 1,
        'the integer `2`': 2,
    },
    object: {
        'an empty object': {},
        'an object': { hi: 'hi' },
    },
    string: {
        'a numeric string': '42',
        'a string': 'string',
        'an empty string': '',
    },
    undefined: {
        '`undefined`': undefined,
    },
};

/**
 * Excluding type
 *
 * @param {string} type
 *
 * @returns {*[][]}
 */
const excludingType = (type) => {
    let { [type]: _, ...remaining } = groups;
    return Object.values(remaining).flatMap((group) => Object.entries(group));
};

/** {*[][]} nonArrayTypes */
const nonArrayTypes = (() => excludingType('array'))();

/** {*[][]} nonBooleanTypes */
const nonBooleanTypes = (() => excludingType('boolean'))();

/** {*[][]} nonFunctionTypes */
let nonFunctionTypes = (() => excludingType('function'))();

/** {*[][]}  nonNullTypes */
let nonNullTypes = (() => excludingType('null'))();

/** {*[][]} nonNumberTypes */
let nonNumberTypes = (() => excludingType('number'))();

/** {*[][]} nonObjectTypes */
let nonObjectTypes = (() => excludingType('object'))();

/** {*[][]} nonStringTypes */
let nonStringTypes = (() => excludingType('string'))();

/** {*[][]} nonUndefinedTypes */
let nonUndefinedTypes = (() => excludingType('undefined'))();

export default ({ assert, describe, it }) => {
    assertions.forEach((func) => {
        describe(`#${func.name}`, () => {
            let result = func();

            it('should return an Object', () => assert(result).isObject());
            it('should return an Object with a `msg` string property', () => assert(result.msg).isString());
            it('should return an Object with an `isOk` boolean property', () => assert(result.isOk).isBoolean());
        });
    });

    describe('#equals', () => {
        describe('given two strings that are equal', () => {
            it('should return a truthy `isOk` property', () => {
                assert(equals('test', 'test').isOk).isTrue();
            });
        });

        describe('given two strings that are not equal', () => {
            it('should return a falsy `isOk` boolean', () => {
                assert(equals('test', '42').isOk).isFalse();
            });
        });

        describe('given two numbers that are equal', () => {
            it('should return a truthy `isOk` property', () => {
                assert(equals(3, 3).isOk).isTrue();
            });
        });

        describe('given two numbers that are not equal', () => {
            it('should return a falsy `isOk` boolean', () => {
                assert(equals(3, 3.2).isOk).isFalse();
            });
        });

        describe('given two values that are not the same type', () => {
            it('should return a falsy `isOk` boolean', () => {
                assert(equals(3, '3').isOk).isFalse();
            });
        });
    });

    describe('#isArray', () => {
        Object.entries(groups.array).forEach(([ key, value ]) => {
            describe(`given ${key}`, () => {
                it('should return a truthy `isOk` property', () => {
                    assert(isArray(value).isOk).isTrue();
                });
            });
        });

        nonArrayTypes.forEach(([ key, value ]) => {
            describe(`given ${key}`, () => {
                it('should return a falsy `isOk` property', () => {
                    assert(isArray(value).isOk).isFalse();
                });
            });
        });
    });

    describe('#isBoolean', () => {
        Object.entries(groups.boolean).forEach(([ key, value ]) => {
            describe(`given ${key}`, () => {
                it('should return a truthy `isOk` property', () => {
                    assert(isBoolean(value).isOk).isTrue();
                });
            });
        });

        nonBooleanTypes.forEach(([ key, value ]) => {
            describe(`given ${key}`, () => {
                it('should return a falsy `isOk` property', () => {
                    assert(isBoolean(value).isOk).isFalse();
                });
            });
        });
    });

    describe('#isFalse', () => {
        describe('given `false`', () => {
            it('should return a truthy `isOk` property', () => {
                assert(isFalse(false).isOk).isTrue();
            });
        });

        describe('given `true`', () => {
            it('should return a falsy `isOk` property', () => {
                assert(isFalse(true).isOk).isFalse();
            });
        });

        nonBooleanTypes.forEach(([ key, value ]) => {
            describe(`given ${key}`, () => {
                it('should return a falsy `isOk` property', () => {
                    assert(isFalse(value).isOk).isFalse();
                });
            });
        });
    });

    describe('#isFunction', () => {
        Object.entries(groups.function).forEach(([ key, value ]) => {
            describe(`given ${key}`, () => {
                it('should return a truthy `isOk` property', () => {
                    assert(isFunction(value).isOk).isTrue();
                });
            });
        });

        nonFunctionTypes.forEach(([ key, value ]) => {
            describe(`given ${key}`, () => {
                it('should return a falsy `isOk` property', () => {
                    assert(isFunction(value).isOk).isFalse();
                });
            });
        });
    });

    describe('#isNull', () => {
        Object.entries(groups.null).forEach(([ key, value ]) => {
            describe(`given ${key}`, () => {
                it('should return a truthy `isOk` property', () => {
                    assert(isNull(value).isOk).isTrue();
                });
            });
        });

        nonNullTypes.forEach(([ key, value ]) => {
            describe(`given ${key}`, () => {
                it('should return a falsy `isOk` property', () => {
                    assert(isNull(value).isOk).isFalse();
                });
            });
        });
    });

    describe('#isNumber', () => {
        Object.entries(groups.number).forEach(([ key, value ]) => {
            describe(`given ${key}`, () => {
                it('should return a truthy `isOk` property', () => {
                    assert(isNumber(value).isOk).isTrue();
                });
            });
        });

        describe('given `NaN`', () => {
            it('should return a falsy `isOk` property', () => {
                assert(isNumber(NaN).isOk).isFalse();
            });
        });

        nonNumberTypes.forEach(([ key, value ]) => {
            describe(`given ${key}`, () => {
                it('should return a falsy `isOk` property', () => {
                    assert(isNumber(value).isOk).isFalse();
                });
            });
        });
    });

    describe('#isObject', () => {
        Object.entries(groups.object).forEach(([ key, value ]) => {
            describe(`given ${key}`, () => {
                it('should return a truthy `isOk` property', () => {
                    assert(isObject(value).isOk).isTrue();
                });
            });
        });

        nonObjectTypes.forEach(([ key, value ]) => {
            describe(`given ${key}`, () => {
                it('should return a falsy `isOk` property', () => {
                    assert(isObject(value).isOk).isFalse();
                });
            });
        });
    });

    describe('#isString', () => {
        Object.entries(groups.string).forEach(([ key, value ]) => {
            describe(`given ${key}`, () => {
                it('should return a truthy `isOk` property', () => {
                    assert(isString(value).isOk).isTrue();
                });
            });
        });

        nonStringTypes.forEach(([ key, value ]) => {
            describe(`given ${key}`, () => {
                it('should return a falsy `isOk` property', () => {
                    assert(isString(value).isOk).isFalse();
                });
            });
        });
    });

    describe('#isTrue', () => {
        describe('given `true`', () => {
            it('should return a truthy `isOk` property', () => {
                assert(isTrue(true).isOk).isTrue();
            });
        });

        describe('given `false`', () => {
            it('should return a falsy `isOk` property', () => {
                assert(isTrue(false).isOk).isFalse();
            });
        });

        nonBooleanTypes.forEach(([ key, value ]) => {
            describe(`given ${key}`, () => {
                it('should return a falsy `isOk` property', () => {
                    assert(isTrue(value).isOk).isFalse();
                });
            });
        });
    });

    describe('#isUndefined', () => {
        describe('given nothing', () => {
            it('should return a truthy `isOk` property', () => {
                assert(isUndefined().isOk).isTrue();
            });
        });

        Object.entries(groups.undefined).forEach(([ key, value ]) => {
            describe(`given ${key}`, () => {
                it('should return a truthy `isOk` property', () => {
                    assert(isUndefined(value).isOk).isTrue();
                });
            });
        });

        nonUndefinedTypes.forEach(([ key, value ]) => {
            describe(`given ${key}`, () => {
                it('should return a falsy `isOk` property', () => {
                    assert(isUndefined(value).isOk).isFalse();
                });
            });
        });
    });

    describe('#stringContains', () => {
        describe('given a non-string type', () => {
            it('should return a falsy `isOk` property', () => {
                assert(stringContains().isOk).isFalse();
            });
        });

        describe('given a string that does not contain the expected string', () => {
            it('should return a falsy `isOk` property', () => {
                assert(stringContains('abcde', '12345').isOk).isFalse();
            });
        });

        describe('given a string that contains the expected string', () => {
            it('should return a falsy `isOk` property', () => {
                assert(stringContains('moose in a bag of holding', 'bag of holding').isOk).isTrue();
            });
        });
    });

    describe('#stringExcludes', () => {
        describe('given a non-string type', () => {
            it('should return a falsy `isOk` property', () => {
                assert(stringExcludes().isOk).isFalse();
            });
        });

        describe('given a string that does not contain the excluded string', () => {
            it('should return a truthy `isOk` property', () => {
                assert(stringExcludes('abcde', '12345').isOk).isTrue();
            });
        });

        describe('given a string that contains the excluded string', () => {
            it('should return a falsy `isOk` property', () => {
                assert(stringExcludes('moose in a bag of holding', 'bag of holding').isOk).isFalse();
            });
        });
    });

    describe('#throws', () => {
        describe('given a non-function', () => {
            it('should return a falsy `isOk` property', () => {
                assert(throws().isOk).isFalse();
            });
        });

        describe('given a function that does not throw', () => {
            it('should return a falsy `isOk` property', () => {
                assert(throws(() => {}).isOk).isFalse();
            });
        });

        describe('given a function that throws', () => {
            it('should return a truthy `isOk` property', () => {
                assert(throws(() => { throw new Error('Junk'); }).isOk).isTrue();
            });
        });
    });
};
