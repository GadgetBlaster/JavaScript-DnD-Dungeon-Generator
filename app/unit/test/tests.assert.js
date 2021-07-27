// @ts-check

import {
    equals,
    equalsArray,
    equalsObject,
    isArray,
    isBoolean,
    isElementTag,
    isFalse,
    isFunction,
    isNull,
    isNumber,
    isObject,
    isString,
    isTrue,
    isUndefined,
    stringExcludes,
    stringIncludes,
    throws,
} from '../assert.js';

const assertions = [
    equals,
    equalsArray,
    isArray,
    isBoolean,
    isElementTag,
    isFalse,
    isFunction,
    isNull,
    isNumber,
    isObject,
    isString,
    isTrue,
    isUndefined,
    stringExcludes,
    stringIncludes,
    throws,
];

/**
 * Groups
 *
 * @type {Object}
 */
const groups = {
    array: {
        'an array'      : [ 'array' ],
        'an empty array': [],
    },
    boolean: {
        '`false`': false,
        '`true`' : true,
    },
    function: {
        'a function': equals, // Any function will do
    },
    null: {
        '`null`': null,
    },
    number: {
        'a float'         : 3.14159,
        'infinity'        : Infinity,
        'the integer `-1`': -1,
        'the integer `0`' : 0,
        'the integer `1`' : 1,
        'the integer `2`' : 2,
    },
    object: {
        'an empty object': {},
        'an object'      : { hi: 'hi' },
    },
    string: {
        'a numeric string': '42',
        'a string'        : 'string',
        'an empty string' : '',
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
 * @returns {any[][]}
 */
const excludingType = (type) => {
    let {
        [type]: _, // eslint-disable-line no-unused-vars
        ...remaining
    } = groups;

    return Object.values(remaining).flatMap((group) => Object.entries(group));
};

/** {any[][]} nonArrayTypes */
const nonArrayTypes = (() => excludingType('array'))();

/** {any[][]} nonBooleanTypes */
const nonBooleanTypes = (() => excludingType('boolean'))();

/** {any[][]} nonFunctionTypes */
let nonFunctionTypes = (() => excludingType('function'))();

/** {any[][]}  nonNullTypes */
let nonNullTypes = (() => excludingType('null'))();

/** {any[][]} nonNumberTypes */
let nonNumberTypes = (() => excludingType('number'))();

/** {any[][]} nonObjectTypes */
let nonObjectTypes = (() => excludingType('object'))();

/** {any[][]} nonStringTypes */
let nonStringTypes = (() => excludingType('string'))();

/** {any[][]} nonUndefinedTypes */
let nonUndefinedTypes = (() => excludingType('undefined'))();

/**
 * @param {import('../state.js').Utility} utility
 */
export default ({ assert, describe, it }) => {
    assertions.forEach((func) => {
        describe(`${func.name}()`, () => {
            // @ts-expect-error
            const result = func();

            it('should return an Object', () => {
                assert(result).isObject();
            });

            it('should return an Object with a `msg` string property', () => {
                assert(result.msg).isString();
            });

            it('should return an Object with an `isOk` boolean property', () => {
                assert(result.isOk).isBoolean();
            });
        });
    });

    describe('equals()', () => {
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
            it('should return a falsy `isOk` property', () => {
                assert(equals(3, 3.2).isOk).isFalse();
            });
        });

        describe('given two values that are not the same type', () => {
            it('should return a falsy `isOk` property', () => {
                assert(equals(3, '3').isOk).isFalse();
            });
        });
    });

    describe('equalsArray()', () => {
        describe('given a value that is not an array', () => {
            it('should return a falsy `isOk` property', () => {
                assert(equalsArray('jumping hobgoblins', []).isOk).isFalse();
            });
        });

        describe('given empty arrays', () => {
            it('should return a truthy `isOk` property', () => {
                assert(equalsArray([], []).isOk).isTrue();
            });
        });

        describe('given arrays that are equal', () => {
            it('should return a truthy `isOk` property', () => {
                assert(equalsArray([ 1, 'horse', false ], [ 1, 'horse', false ]).isOk).isTrue();
            });
        });

        describe('given arrays with objects', () => {
            it('should return a falsy `isOk` property', () => {
                assert(equalsArray([ {} ], [ {} ]).isOk).isFalse();
            });
        });

        describe('given arrays with different lengths', () => {
            it('should return a falsy `isOk` property', () => {
                assert(equalsArray([ 'RoboCop' ], [ 'Tango', 'Whisky', 'Foxtrot' ]).isOk).isFalse();
            });
        });

        describe('given arrays with different values', () => {
            it('should return a falsy `isOk` property', () => {
                assert(equalsArray([ 'joey' ], [ 'paul' ]).isOk).isFalse();
            });
        });
    });

    describe('equalsObject()', () => {
        describe('given a value that is not a object', () => {
            it('should return a falsy `isOk` property', () => {
                assert(equalsObject('sinking hippogryphs').isOk).isFalse();
            });
        });

        describe('given empty objects', () => {
            it('should return a truthy `isOk` property', () => {
                assert(equalsObject({}, {}).isOk).isTrue();
            });
        });

        describe('given objects that are equal', () => {
            it('should return a truthy `isOk` property', () => {
                assert(equalsObject({ joey: 'the spell caster' }, { joey: 'the spell caster' }).isOk).isTrue();
            });
        });

        describe('given objects with different keys', () => {
            it('should return a falsy `isOk` property', () => {
                assert(equalsObject({ joey: 'the spell caster' }, { pablo: 'the spell caster' }).isOk).isFalse();
            });
        });

        describe('given objects with different values', () => {
            it('should return a falsy `isOk` property', () => {
                assert(equalsObject({ joey: 'the spell caster' }, { joey: 'the rogue' }).isOk).isFalse();
            });
        });

        describe('given objects with nested objects', () => {
            describe('when the nested objects are the same', () => {
                it('should return a truthy `isOk` property', () => {
                    const obj1 = { joey: { occupation: 'spell caster' } };
                    const obj2 = { joey: { occupation: 'spell caster' } };

                    assert(equalsObject(obj1, obj2).isOk).isTrue();
                });

                describe('when there is a nested array of objects', () => {
                    it('should return a truthy `isOk` property', () => {
                        const obj1 = { party: [ { joey: 'spell caster' }, { pablo: 'the spell caster' } ] };
                        const obj2 = { party: [ { joey: 'spell caster' }, { pablo: 'the spell caster' } ] };

                        assert(equalsObject(obj1, obj2).isOk).isTrue();
                    });
                });
            });

            describe('when the nested objects are different', () => {
                it('should return a truthy `isOk` property', () => {
                    const obj1 = { joey: { occupation: 'spell caster' } };
                    const obj2 = { joey: { occupation: 'rogue' } };

                    assert(equalsObject(obj1, obj2).isOk).isFalse();
                });

                describe('when there are 3 levels of nested objects', () => {
                    it('should return a truthy `isOk` property', () => {
                        const obj1 = { joey: { occupation: 'spell caster', attributes: { height: 12, eyes: 'blue' } } };
                        const obj2 = { joey: { occupation: 'spell caster', attributes: { height: 12, eyes: 'red'  } } };

                        assert(equalsObject(obj1, obj2).isOk).isFalse();
                    });
                });

                describe('when there is a nested array of objects', () => {
                    it('should return a truthy `isOk` property', () => {
                        const obj1 = { party: [ { joey: 'spell caster' }, { pablo: 'the spell caster' } ] };
                        const obj2 = { party: [ { joey: 'the rogue' }, { pablo: 'the rogue' } ] };

                        assert(equalsObject(obj1, obj2).isOk).isFalse();
                    });
                });
            });
        });
    });

    describe('isArray()', () => {
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

    describe('isBoolean()', () => {
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

    describe('isFalse()', () => {
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

    describe('isFunction()', () => {
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

    describe('isElementTag()', () => {
        describe('given a string that is the desired html tag', () => {
            it('should return a truthy `isOk` property', () => {
                assert(isElementTag('<strong>Wizards!</strong>', 'strong').isOk).isTrue();
            });
        });

        describe('given a string that is the desired html tag with attributes', () => {
            it('should return a truthy `isOk` property', () => {
                assert(isElementTag('<strong data-type="goblin">Goblins</strong>', 'strong').isOk).isTrue();
            });
        });

        describe('given a string that is not an html tag', () => {
            it('should return a falsy `isOk` property', () => {
                assert(isElementTag('Grumpy wizards', 'b').isOk).isFalse();
            });
        });

        describe('given a string that is not the desired html tag', () => {
            it('should return a falsy `isOk` property', () => {
                assert(isElementTag('<div>Goblins</div>', 'b').isOk).isFalse();
            });
        });

        describe('given a string that does not start with an html tag', () => {
            it('should return a falsy `isOk` property', () => {
                assert(isElementTag('The crafty <span>Pixie</span>', 'span').isOk).isFalse();
            });
        });

        describe('given a string that does not end with an html tag', () => {
            it('should return a falsy `isOk` property', () => {
                assert(isElementTag('<span>Pixies</span> can turn invisible', 'span').isOk).isFalse();
            });
        });

        describe('given a string that is a malformed html tag', () => {
            it('should return a falsy `isOk` property', () => {
                assert(isElementTag('p>Pixies</p>', 'p').isOk).isFalse();
                assert(isElementTag('<>Pixies</p>', 'p').isOk).isFalse();
                assert(isElementTag('<pPixies</p>', 'p').isOk).isFalse();
                assert(isElementTag('<p>Pixies/p>', 'p').isOk).isFalse();
                assert(isElementTag('<p>Pixies<p>', 'p').isOk).isFalse();
                assert(isElementTag('<p>Pixies</>', 'p').isOk).isFalse();
                assert(isElementTag('<p>Pixies</p', 'p').isOk).isFalse();
                assert(isElementTag('<input>', 'input').isOk).isFalse();
                assert(isElementTag('<input', 'input').isOk).isFalse();
                assert(isElementTag('<input /', 'input').isOk).isFalse();
                assert(isElementTag('input />', 'input').isOk).isFalse();
            });
        });

        describe('given a self closing html tag', () => {
            it('should return a truthy `isOk` property', () => {
                assert(isElementTag('<input name="ted" />', 'input').isOk).isTrue();
            });
        });

        describe('given multiple tags', () => {
            it('should return a falsy `isOk` property', () => {
                assert(isElementTag('<p>Hello</p><p>Dungeon</p>', 'input').isOk).isFalse();
            });
        });

        describe('given multiple self closing tags', () => {
            it('should return a falsy `isOk` property', () => {
                assert(isElementTag('<input /><input />', 'input').isOk).isFalse();
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

    describe('isNull()', () => {
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

    describe('isNumber()', () => {
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

    describe('isObject()', () => {
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

    describe('isString()', () => {
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

    describe('isTrue()', () => {
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

    describe('isUndefined()', () => {
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

    describe('stringIncludes()', () => {
        describe('given a non-string type', () => {
            it('should return a falsy `isOk` property', () => {
                // @ts-expect-error
                assert(stringIncludes(undefined).isOk).isFalse();
            });
        });

        describe('given a string that does not contain the expected string', () => {
            it('should return a falsy `isOk` property', () => {
                assert(stringIncludes('abcde', '12345').isOk).isFalse();
            });
        });

        describe('given a string that contains the expected string', () => {
            it('should return a falsy `isOk` property', () => {
                assert(stringIncludes('moose in a bag of holding', 'bag of holding').isOk).isTrue();
            });
        });

        describe('given an empty string', () => {
            it('should return a falsy `isOk` property', () => {
                assert(() => stringIncludes('long sword +1', ''))
                    .throws('Invalid empty string expected in `stringIncludes`');
            });
        });
    });

    describe('stringExcludes()', () => {
        describe('given a non-string type', () => {
            it('should return a falsy `isOk` property', () => {
                // @ts-expect-error
                assert(stringExcludes(undefined).isOk).isFalse();
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

    describe('throws()', () => {
        describe('given a non-function', () => {
            it('should return a falsy `isOk` property', () => {
                assert(throws(undefined, 'junk').isOk).isFalse();
            });
        });

        describe('given a function that does not throw', () => {
            it('should return a falsy `isOk` property', () => {
                assert(throws(() => {}, 'junk').isOk).isFalse();
            });
        });

        describe('given a function that throws', () => {
            describe('given a function that throws an unexpected error message', () => {
                it('should return a falsy `isOk` property', () => {
                    assert(throws(() => { throw new TypeError('Junk'); }, 'Not junk').isOk).isFalse();
                });
            });

            describe('given a function that throws the expected error message', () => {
                it('should return a falsy `isOk` property', () => {
                    assert(throws(() => { throw new TypeError('Peanuts'); }, 'Peanuts').isOk).isTrue();
                });
            });
        });
    });
};
