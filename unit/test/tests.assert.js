
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
    isNull,
    isNumber,
    isObject,
    isString,
    isTrue,
    isUndefined,
];

/**
 * Types
 *
 * @type {Object}
 */
const types = {
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
 * @returns {Array}
 */
const excludingType = (type) => {
    let { [type]: _, ...remaining } = types;
    return Object.values(remaining).flatMap((group) => Object.entries(group));
};

/** {*[]} nonArrayTypes */
const nonArrayTypes = (() => excludingType('array'))();

/** {*[]} nonBooleanTypes */
const nonBooleanTypes = (() => excludingType('boolean'))();

/** {*[]} nonNullTypes */
let nonNullTypes = (() => excludingType('null'))();

/** {*[]} nonNumberTypes */
let nonNumberTypes = (() => excludingType('number'))();

/** {*[]} nonObjectTypes */
let nonObjectTypes = (() => excludingType('object'))();

/** {*[]} nonStringTypes */
let nonStringTypes = (() => excludingType('string'))();

/** {*[]} nonUndefinedTypes */
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
        Object.entries(types.array).forEach(([ key, value ]) => {
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
        Object.entries(types.boolean).forEach(([ key, value ]) => {
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

    describe('#isNull', () => {
        Object.entries(types.null).forEach(([ key, value ]) => {
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
        Object.entries(types.number).forEach(([ key, value ]) => {
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
        Object.entries(types.object).forEach(([ key, value ]) => {
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
        Object.entries(types.string).forEach(([ key, value ]) => {
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

        Object.entries(types.undefined).forEach(([ key, value ]) => {
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
};