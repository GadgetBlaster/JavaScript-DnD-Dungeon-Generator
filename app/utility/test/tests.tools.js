
import {
    toWords,
    toDash,
    capitalize,
    isOdd,
    isEven,
    chunk,
    listSentence,
    plural,
 } from '../tools.js';

/**
 * @param {import('../../../unit/unit.js').Utility}
 */
export default ({ assert, describe, it }) => {
    describe('#toWords', () => {
        describe('given a camel case string', () => {
            it('should return a lowercased string broken into multiple words', () => {
                assert(toWords('bustedBulldozingBrachiosaurus')).equals('busted bulldozing brachiosaurus');
            });
        });
    });

    describe('#toDash', () => {
        describe('given a string with spaces', () => {
            it('should return a lowercased string with the words dash separated', () => {
                assert(toDash('Teleporting Mythical Creature')).equals('teleporting-mythical-creature');
            });
        });
    });

    describe('#capitalize', () => {
        describe('given a string that starts with a lowercase letter', () => {
            it('should capitalize the first letter in the string', () => {
                assert(capitalize('joe bob')).equals('Joe bob');
            });
        });
    });

    describe('#isOdd', () => {
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

    describe('#isEven', () => {
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

    describe('#chunk', () => {
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

    describe('#listSentence', () => {

    });

    describe('#plural', () => {

    });
};
