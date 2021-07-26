// @ts-check

import {
    capitalize,
    chunk,
    indefiniteArticle,
    isEven,
    isOdd,
    isRequired,
    listSentence,
    plural,
    toDash,
    toss,
    toWords,
 } from '../tools.js';

/**
 * @param {import('../../unit/state.js').Utility} utility
 */
export default ({ assert, describe, it }) => {

    // -- Typography -----------------------------------------------------------

    describe('capitalize()', () => {
        describe('given a string that starts with a lowercase letter', () => {
            it('should capitalize the first letter in the string', () => {
                assert(capitalize('joe bob')).equals('Joe bob');
            });
        });
    });

    describe('indefiniteArticle()', () => {
        describe('given a word that does not start with a vowel', () => {
            it('should return "a"', () => {
                assert(indefiniteArticle('hammock')).equals('a');
            });
        });

        [ 'apple', 'elephant', 'igloo', 'otter', 'udder' ].forEach((word) => {
            describe('given a word that starts with a vowel', () => {
                it('should return "an"', () => {
                    assert(indefiniteArticle(word)).equals('an');
                });
            });
        });
    });

    describe('listSentence()', () => {
        describe('given no items', () => {
            it('should return undefined', () => {
                assert(listSentence([])).isUndefined();
            });
        });

        describe('given an array of one strings', () => {
            it('should return the string', () => {
                assert(listSentence([ 'primus' ])).equals('primus');
            });
        });

        describe('given an array of two strings', () => {
            it('should return the strings joined by `and` with first word capitalized', () => {
                assert(listSentence([ 'hummingbirds', 'jellyfish' ])).equals('hummingbirds and jellyfish');
            });
        });

        describe('given an array of three strings', () => {
            it('should return the strings joined by commas with `and` between the last two', () => {
                assert(listSentence([ 'hammers', 'polar bears', 'walruses' ]))
                    .equals('hammers, polar bears, and walruses');
            });
        });

        describe('given an array of four strings', () => {
            it('should return the strings joined by commas with `and` between the last two', () => {
                assert(listSentence([ 'one', 'two', 'three', 'four' ])).equals('one, two, three, and four');
            });
        });
    });

    describe('plural()', () => {
        describe('given a count of 1', () => {
            it('should return the string', () => {
                assert(plural(1, 'cat')).equals('cat');
            });
        });

        describe('given a count of 0', () => {
            it('should return a pluralized string', () => {
                assert(plural(0, 'cat')).equals('cats');
            });
        });

        describe('given a count of 2', () => {
            it('should return a pluralized string', () => {
                assert(plural(2, 'cat')).equals('cats');
            });
        });

        describe('given a count of 3', () => {
            it('should return the string', () => {
                assert(plural(3, 'cat')).equals('cats');
            });
        });

        describe('given a count of 2 and a suffix of `es`', () => {
            it('should return the string', () => {
                assert(plural(2, 'walrus', 'es')).equals('walruses');
            });
        });
    });

    describe('toDash()', () => {
        describe('given a string with spaces', () => {
            it('should return a lower cased string with the words dash separated', () => {
                assert(toDash('Teleporting Mythical Creature')).equals('teleporting-mythical-creature');
            });
        });
    });

    describe('toWords()', () => {
        describe('given a camel case string', () => {
            it('should return a lower cased string broken into multiple words', () => {
                assert(toWords('bustedBulldozingBrachiosaurus')).equals('busted bulldozing brachiosaurus');
            });
        });
    });

    // -- Numeric --------------------------------------------------------------

    describe('isEven()', () => {
        describe('given an odd number', () => {
            it('should return `false`', () => {
                assert(isEven(3)).isFalse();
            });
        });

        describe('given an even number', () => {
            it('should return `true`', () => {
                assert(isEven(12)).isTrue();
            });
        });

        describe('given zero', () => {
            it('should return `true`', () => {
                assert(isEven(0)).isTrue();
            });
        });
    });

    describe('isOdd()', () => {
        describe('given an odd number', () => {
            it('should return `true`', () => {
                assert(isOdd(1)).isTrue();
            });
        });

        describe('given an even number', () => {
            it('should return `true`', () => {
                assert(isOdd(6)).isFalse();
            });
        });

        describe('given zero', () => {
            it('should return `false`', () => {
                assert(isOdd(0)).isFalse();
            });
        });
    });

    // -- Array ----------------------------------------------------------------

    describe('chunk()', () => {
        describe('given an empty array', () => {
            it('should return an empty array', () => {
                let chunks = chunk([], 0);
                assert(chunks).isArray();
                assert(chunks.length).equals(0);
            });
        });

        describe('given an array of 10 items and chunk size of 2', () => {
            let chunks = chunk(Array.from(Array(10).keys()), 2);

            it('should return an array', () => {
                assert(chunks).isArray();
            });

            it('should return an array with five items', () => {
                assert(chunks.length).equals(5);
            });

            it('should return an array', () => {
                chunks.forEach((c) => {
                    assert(c).isArray();
                });
            });

            it('should have tow items in each array', () => {
                chunks.forEach((c) => {
                    assert(c.length).equals(2);
                });
            });

            it('should group the items in groups of two in sequential order', () => {
                assert(chunks[0]).equalsArray([ 0, 1 ]);
                assert(chunks[1]).equalsArray([ 2, 3 ]);
                assert(chunks[2]).equalsArray([ 4, 5 ]);
                assert(chunks[3]).equalsArray([ 6, 7 ]);
                assert(chunks[4]).equalsArray([ 8, 9 ]);
            });
        });

        describe('given an array of 4 and a chunk size of 3', () => {
            it('should have the remainder in the last array', () => {
                let chunks = chunk([ 1, 2, 3, 4 ], 3);
                assert(chunks[1].length).equals(1);
                assert(chunks[1].pop()).equals(4);
            });
        });

        describe('given a chunk size the same as the array length', () => {
            it('should have a single chunk', () => {
                let chunks = chunk(Array.from(Array(3)), 3);
                assert(chunks.length).equals(1);
            });

            it('should have a single chunk the same length as the array', () => {
                let chunks = chunk(Array.from(Array(3)), 3);
                assert(chunks[0].length).equals(3);
            });

            it('should have a chunk identical to the array', () => {
                let chunks = chunk([ 0, 1, 2 ], 3);
                assert(chunks[0]).equalsArray([ 0, 1, 2 ]);
            });
        });

        describe('given a chunk size larger than the array length', () => {
            it('should have a single chunk', () => {
                let chunks = chunk(Array.from(Array(3).keys()), 4);
                assert(chunks.length).equals(1);
            });

            it('should have a chunk identical to the array', () => {
                let chunks = chunk(Array.from(Array(3).keys()), 4);
                assert(chunks[0]).equalsArray([ 0, 1, 2 ]);
            });
        });
    });

    // -- Throw ----------------------------------------------------------------

    describe('toss()', () => {
        it('should throw a type error', () => {
            assert(() => toss('These aren\'t the droids you are looking for.'))
                .throws('These aren\'t the droids you are looking for.');
        });
    });

    describe('isRequired()', () => {
        describe('given an undefined value', () => {
            it('should throw the given message', () => {
                assert(() => isRequired(undefined, 'No good dude')).throws('No good dude');
            });
        });

        describe('given defined value', () => {
            it('should return undefined', () => {
                assert(isRequired('Good stuff', 'No good dude')).equals(undefined);
            });
        });
    });
};
