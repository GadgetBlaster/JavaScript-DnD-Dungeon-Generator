
import { describe, it, assert } from '../unit.js';
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
 * Types
 *
 * @type {Object}
 */
const types = {
    array: [ 'array' ],
    arrayEmpty: [],
    boolFalse: false,
    boolTrue: true,
    func: () => {},
    nullValue: null,
    numbFloat: 3.14159,
    numbInfinity: Infinity,
    numbNegOne: -1,
    numbOne: 1,
    numbTwo: 2,
    numbZero: 0,
    object: { hi: 'hi' },
    objectEmpty: {},
    string: 'string',
    stringEmpty: '',
    undefined: undefined,
};

/** {*[]} nonArrayTypes */
const nonArrayTypes = (() => {
    let { array, arrayEmpty, ...remaining } = types;
    return Object.values(remaining);
})();

/** {*[]} nonBooleanTypes */
const nonBooleanTypes = (() => {
    let { boolFalse, boolTrue, ...remaining } = types;
    return Object.values(remaining);
})();

/** {*[]} nonNullTypes */
let nonNullTypes = (() => {
    let { nullValue, ...remaining } = types;
    return Object.values(remaining);
})();

/** {*[]} nonNumberTypes */
let nonNumberTypes = (() => {
    let { numbFloat, numbInfinity, numbNegOne, numbOne, numbTwo, numbZero, ...remaining } = types;
    return Object.values(remaining);
})();

/** {*[]} nonObjectTypes */
let nonObjectTypes = (() => {
    let { object, objectEmpty, ...remaining } = types;
    return Object.values(remaining);
})();

/** {*[]} nonStringTypes */
let nonStringTypes = (() => {
    let { string, stringEmpty, ...remaining } = types;
    return Object.values(remaining);
})();

/** {*[]} nonUndefinedTypes */
let nonUndefinedTypes = (() => {
    let { undefined, ...remaining } = types;
    return Object.values(remaining);
})();

describe('assert', () => {
    [ equals, isArray, isBoolean, isFalse, isNull, isNumber, isObject, isString, isTrue, isUndefined ].forEach((func) => {
        describe(`#${func.name} return`, () => {
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
    });

    describe('#isArray', () => {
        describe('given an empty Array', () => {
            it('should return a truthy `isOk` property', () => {
                assert(isArray([]).isOk).isTrue();
            });
        });

        describe('given an Array with values', () => {
            it('should return a truthy `isOk` property', () => {
                assert(isArray([ 'one', 'two' ]).isOk).isTrue();
            });
        });

        nonArrayTypes.forEach((value) => {
            describe(`given ${value}`, () => {
                it('should return a falsy `isOk` property', () => {
                    assert(isArray(value).isOk).isFalse();
                });
            });
        });
    });

    describe('#isBoolean', () => {
        describe('given `true`', () => {
            it('should return a truthy `isOk` property', () => {
                assert(isBoolean(true).isOk).isTrue();
            });
        });

        describe('given `false`', () => {
            it('should return a truthy `isOk` property', () => {
                assert(isBoolean(false).isOk).isTrue();
            });
        });

        nonBooleanTypes.forEach((value) => {
            describe(`given ${value}`, () => {
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

        nonBooleanTypes.forEach((value) => {
            describe(`given ${value}`, () => {
                it('should return a falsy `isOk` property', () => {
                    assert(isFalse(value).isOk).isFalse();
                });
            });
        });
    });

    describe('#isNull', () => {
        describe('given `null`', () => {
            it('should return a truthy `isOk` property', () => {
                assert(isNull(null).isOk).isTrue();
            });
        });

        nonNullTypes.forEach((value) => {
            describe(`given ${value}`, () => {
                it('should return a falsy `isOk` property', () => {
                    assert(isNull(value).isOk).isFalse();
                });
            });
        });
    });

    describe('#isNumber', () => {
        describe('given an Integer', () => {
            it('should return a truthy `isOk` property', () => {
                assert(isNumber(2).isOk).isTrue();
            });
        });

        describe('given a Float', () => {
            it('should return a falsy `isOk` property', () => {
                assert(isNumber(3.14).isOk).isTrue();
            });
        });

        describe('given `0`', () => {
            it('should return a truthy `isOk` property', () => {
                assert(isNumber(0).isOk).isTrue();
            });
        });

        describe('given `Infinity`', () => {
            it('should return a truthy `isOk` property', () => {
                assert(isNumber(Infinity).isOk).isTrue();
            });
        });

        describe('given `NaN`', () => {
            it('should return a falsy `isOk` property', () => {
                assert(isNumber(NaN).isOk).isFalse();
            });
        });

        nonNumberTypes.forEach((value) => {
            describe(`given ${value}`, () => {
                it('should return a falsy `isOk` property', () => {
                    assert(isNumber(value).isOk).isFalse();
                });
            });
        });
    });

    describe('#isObject', () => {
        describe('given an empty Object', () => {
            it('should return a truthy `isOk` property', () => {
                assert(isObject({}).isOk).isTrue();
            });
        });

        describe('given an Object with properties', () => {
            it('should return a truthy `isOk` property', () => {
                assert(isObject({ hi: 'hi' }).isOk).isTrue();
            });
        });

        nonObjectTypes.forEach((value) => {
            describe(`given ${value}`, () => {
                it('should return a falsy `isOk` property', () => {
                    assert(isObject(value).isOk).isFalse();
                });
            });
        });
    });

    describe('#isString', () => {
        describe('given an empty String', () => {
            it('should return a truthy `isOk` property', () => {
                assert(isString('').isOk).isTrue();
            });
        });

        describe('given a non-empty string', () => {
            it('should return a truthy `isOk` property', () => {
                assert(isString('hi').isOk).isTrue();
            });
        });

        nonStringTypes.forEach((value) => {
            describe(`given ${value}`, () => {
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

        nonBooleanTypes.forEach((value) => {
            describe(`given ${value}`, () => {
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

        describe('given `undefined`', () => {
            it('should return a truthy `isOk` property', () => {
                assert(isUndefined(undefined).isOk).isTrue();
            });
        });

        nonUndefinedTypes.forEach((value) => {
            describe(`given ${value}`, () => {
                it('should return a falsy `isOk` property', () => {
                    assert(isUndefined(value).isOk).isFalse();
                });
            });
        });
    });
});
