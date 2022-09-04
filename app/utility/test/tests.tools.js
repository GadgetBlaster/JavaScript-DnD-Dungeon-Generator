// @ts-check

import {
    capitalize,
    capitalizeWords,
    chunk,
    createRangeLookup,
    getErrorMessage,
    indefiniteArticle,
    isEven,
    isOdd,
    isRequired,
    pluralize,
    sentenceList,
    toDash,
    toss,
    toWords,
} from '../tools.js';

/**
 * @param {import('../../unit/state.js').Utility} utility
 */
export default ({ assert, describe, it }) => {

    // -- Public Functions -----------------------------------------------------

    // -- Typography -----------------------------------------------------------

    describe('capitalize()', () => {
        describe('given a string that starts with a lowercase letter', () => {
            it('capitalizes the first letter in the string', () => {
                assert(capitalize('joe bob')).equals('Joe bob');
            });
        });
    });

    describe('capitalizeWords()', () => {
        describe('given a string with a single word', () => {
            it('capitalizes the first letter of the word', () => {
                assert(capitalizeWords('bat')).equals('Bat');
            });
        });

        describe('given a string with multiple words', () => {
            it('capitalizes the first letter of each word', () => {
                assert(capitalizeWords('lazy giraffes casting spells'))
                    .equals('Lazy Giraffes Casting Spells');
            });
        });
    });

    describe('indefiniteArticle()', () => {
        describe('given a word that does not start with a vowel', () => {
            it('returns "a"', () => {
                assert(indefiniteArticle('hammock')).equals('a');
            });
        });

        [ 'apple', 'elephant', 'igloo', 'otter', 'udder' ].forEach((word) => {
            describe(`given "${word}", which starts with a vowel`, () => {
                it('returns "an"', () => {
                    assert(indefiniteArticle(word)).equals('an');
                });
            });
        });
    });

    describe('pluralize()', () => {
        describe('given a count of 0', () => {
            it('pluralizes the string', () => {
                assert(pluralize(0, 'cat')).equals('cats');
            });
        });

        describe('given a count of 1', () => {
            it('returns the string unmodified', () => {
                assert(pluralize(1, 'cat')).equals('cat');
            });
        });

        describe('given a count of 2', () => {
            it('pluralizes the string', () => {
                assert(pluralize(2, 'cat')).equals('cats');
            });
        });

        describe('given a count of 3', () => {
            it('pluralizes the string', () => {
                assert(pluralize(3, 'cat')).equals('cats');
            });
        });

        describe('given a count of 2 and a suffix of `es`', () => {
            it('pluralizes the string', () => {
                assert(pluralize(2, 'walrus', 'es')).equals('walruses');
            });
        });
    });

    describe('sentenceList()', () => {
        describe('given no items', () => {
            it('returns undefined', () => {
                assert(sentenceList([])).isUndefined();
            });
        });

        describe('given an array of one strings', () => {
            it('returns the string', () => {
                assert(sentenceList([ 'primus' ])).equals('primus');
            });
        });

        describe('given an array of two strings', () => {
            it('returns the strings joined by "and"', () => {
                assert(sentenceList([ 'hummingbirds', 'jellyfish' ]))
                    .equals('hummingbirds and jellyfish');
            });
        });

        describe('given an array of three strings', () => {
            it('returns the strings joined by commas with "and" between the last two', () => {
                assert(sentenceList([ 'hammers', 'polar bears', 'walruses' ]))
                    .equals('hammers, polar bears, and walruses');
            });
        });

        describe('given an array of four strings', () => {
            it('returns the strings joined by commas with "and" between the last two', () => {
                assert(sentenceList([ 'one', 'two', 'three', 'four' ]))
                    .equals('one, two, three, and four');
            });
        });
    });

    describe('toDash()', () => {
        describe('given a string with spaces', () => {
            it('returns a lower cased string with the words dash separated', () => {
                assert(toDash('Teleporting Mythical Creature'))
                    .equals('teleporting-mythical-creature');
            });
        });
    });

    describe('toWords()', () => {
        describe('given a camel case string', () => {
            it('returns a lower cased string broken into multiple words', () => {
                assert(toWords('bustedBulldozingBrachiosaurus'))
                    .equals('busted bulldozing brachiosaurus');
            });
        });
    });

    // -- Numeric --------------------------------------------------------------

    describe('isEven()', () => {
        describe('given an odd number', () => {
            it('returns `false`', () => {
                assert(isEven(3)).isFalse();
            });
        });

        describe('given an even number', () => {
            it('returns `true`', () => {
                assert(isEven(12)).isTrue();
            });
        });

        describe('given zero', () => {
            it('returns `true`', () => {
                assert(isEven(0)).isTrue();
            });
        });
    });

    describe('isOdd()', () => {
        describe('given an odd number', () => {
            it('returns `true`', () => {
                assert(isOdd(1)).isTrue();
            });
        });

        describe('given an even number', () => {
            it('returns `true`', () => {
                assert(isOdd(6)).isFalse();
            });
        });

        describe('given zero', () => {
            it('returns `false`', () => {
                assert(isOdd(0)).isFalse();
            });
        });
    });

    // -- Array ----------------------------------------------------------------

    describe('chunk()', () => {
        describe('given an empty array', () => {
            it('returns an empty array', () => {
                let chunks = chunk([], 0);

                assert(chunks).isArray();
                assert(chunks.length).equals(0);
            });
        });

        describe('given an array of 10 items and chunk size of 2', () => {
            let chunks = chunk(Array.from(Array(10).keys()), 2);

            it('returns an array', () => {
                assert(chunks).isArray();
            });

            it('returns an array with five items', () => {
                assert(chunks.length).equals(5);
            });

            it('each item is an array with two items', () => {
                chunks.forEach((c) => {
                    assert(c).isArray();
                    assert(c.length).equals(2);
                });
            });

            it('groups the items in sequential order', () => {
                assert(chunks[0]).equalsArray([ 0, 1 ]);
                assert(chunks[1]).equalsArray([ 2, 3 ]);
                assert(chunks[2]).equalsArray([ 4, 5 ]);
                assert(chunks[3]).equalsArray([ 6, 7 ]);
                assert(chunks[4]).equalsArray([ 8, 9 ]);
            });
        });

        describe('given an array of 4 items and a chunk size of 3', () => {
            it('puts the remainder in the last array', () => {
                let chunks = chunk([ 1, 2, 3, 4 ], 3);

                assert(chunks[1].length).equals(1);
                assert(chunks[1].pop()).equals(4);
            });
        });

        describe('given a chunk size the same as the array length', () => {
            let chunks = chunk(Array.from(Array(3).keys()), 3);

            it('has a single chunk', () => {
                assert(chunks.length).equals(1);
            });

            it('has a single chunk the same length as the array', () => {
                assert(chunks[0].length).equals(3);
            });

            it('has a chunk identical to the array', () => {
                assert(chunks[0]).equalsArray([ 0, 1, 2 ]);
            });
        });

        describe('given a chunk size larger than the array length', () => {
            let chunks = chunk(Array.from(Array(3).keys()), 4);

            it('has a single chunk', () => {
                assert(chunks.length).equals(1);
            });

            it('has a chunk identical to the array', () => {
                assert(chunks[0]).equalsArray([ 0, 1, 2 ]);
            });
        });
    });

    // -- Object ---------------------------------------------------------------

    describe('createRangeLookup()', () => {
        describe('given no minimums object', () => {
            it('throws', () => {
                // @ts-expect-error
                assert(() => createRangeLookup())
                    .throws('Invalid minimums object given in createRangeLookup()');
            });
        });

        describe('given an empty minimums object', () => {
            it('throws', () => {
                assert(() => createRangeLookup({}))
                    .throws('Invalid minimums object given in createRangeLookup()');
            });
        });

        describe('given a minimums object with an invalid minimum', () => {
            it('throws', () => {
                assert(() => createRangeLookup({ first: 100, second: 100 }))
                    .throws('Max cannot be less than min in in createRangeLookup() for key "first"');
            });
        });

        describe('given a minimums object with a single minimum', () => {
            it('returns a range lookup keyed the same as the minimums object', () => {
                assert(createRangeLookup({ gopher: 23 }))
                    .equalsObject({ gopher: {
                        min: 23,
                        max: Number.POSITIVE_INFINITY,
                    }});
            });
        });

        describe('given a minimums object with a maximum value', () => {
            it('returns a range lookup with the correct maximum', () => {
                assert(createRangeLookup({ gopher: 23 }, 32))
                    .equalsObject({ gopher: { min: 23, max: 32 }});
            });
        });

        describe('given a minimums object with several values', () => {
            it('returns a range lookup with correct ranges', () => {
                assert(createRangeLookup({
                    gopher: 23,
                    bird  : 24,
                    dog   : 32,
                    cat   : 36,
                    monkey: 48,
                }, 62))
                    .equalsObject({
                        gopher: { min: 23, max: 23 },
                        bird  : { min: 24, max: 31 },
                        dog   : { min: 32, max: 35 },
                        cat   : { min: 36, max: 47 },
                        monkey: { min: 48, max: 62 },
                    });
            });
        });
    });

    // -- Throw ----------------------------------------------------------------

    describe('toss()', () => {
        it('throws', () => {
            assert(() => toss('These aren\'t the droids you are looking for.'))
                .throws('These aren\'t the droids you are looking for.');
        });
    });

    describe('isRequired()', () => {
        describe('given an undefined value', () => {
            it('throws the given message', () => {
                assert(() => isRequired(undefined, 'No good dude')).throws('No good dude');
            });
        });

        describe('given defined value', () => {
            it('returns undefined', () => {
                assert(isRequired('Good stuff', 'No good dude')).equals(undefined);
            });
        });
    });

    // -- Error Handling -----------------------------------------------------------

    describe('getErrorMessage()', () => {
        describe('when the error is a string', () => {
            it('returns the error', () => {
                assert(getErrorMessage('this bad')).equals('this bad');
            });
        });

        describe('when the error is an Error object', () => {
            it('returns a stringified version of the error stack', () => {
                assert(getErrorMessage(new Error('this real bad')))
                    .stringIncludes('Error: this real bad')
                    .stringIncludes('/app/utility/test/tests.tools.js:368:40');
            });
        });

        describe('when the error is an object', () => {
            describe('when the object can be stringified', () => {
                it('returns a stringified version of the error object', () => {
                    assert(getErrorMessage({ something: 'went wrong' }))
                        .equals('{"something":"went wrong"}');
                });
            });

            describe('when the object _cannot_ be stringified', () => {
                it('returns a stringified version of the error object', () => {
                    assert(getErrorMessage({ x: 2n }))
                        .stringIncludes('Unable to stringify object: ')
                        .stringIncludes('TypeError: Do not know how to serialize a BigInt');
                });
            });
        });

        describe('when the type is unknown', () => {
            it('returns a string for the given value', () => {
                assert(getErrorMessage(216))
                    .equals('Unknown error type: 216');
            });
        });
    });
};
