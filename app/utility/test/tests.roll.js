// @ts-check

import {
    // Public Functions
    createProbability,
    roll,
    rollArrayItem,
    rollPercentile,
} from '../roll.js';

/**
 * @param {import('../../unit/state.js').Utility} utility
 */
export default ({ assert, describe, it }) => {

    // -- Public Functions -----------------------------------------------------

    describe('createProbability()', () => {
        describe('given a valid distribution table', () => {
            const probability = createProbability(new Map(([[ 23, 'boats' ]])));

            it('returns an object', () => {
                assert(probability).isObject();
            });

            it('returns an object with a string property description', () => {
                assert(probability.description).isString();
            });

            it('returns an object with a function property roll', () => {
                assert(probability.roll).isFunction();
            });
        });

        describe('probability description', () => {
            const probability = createProbability(new Map([
                [ 23, 'boats' ],
                [ 55, 'horses' ],
            ]));

            it('includes the probability range and value for each distribution table entry', () => {
                assert(probability.description)
                    .stringIncludes('1-23% boats')
                    .stringIncludes('24-55% horses');
            });
        });

        describe('roll()', () => {
            const probability = createProbability(new Map([
                [ 50,  'potion of healing' ],
                [ 100, 'potion of love'    ],
            ]));

            it('returns one of the values from the distribution table', () => {
                assert(probability.roll()).isInArray([ 'potion of healing', 'potion of love' ]);
            });
        });

        describe('given a distribution table that is not a Map', () => {
            it('throws', () => {
                // @ts-expect-error
                assert(() => { createProbability('junk'); })
                    .throws('distributionTable must be a Map in createProbability()');
            });
        });

        describe('given an empty distribution table', () => {
            it('throws', () => {
                assert(() => { createProbability(new Map([])); })
                    .throws('distributionTable Map must have values in createProbability()');
            });
        });

        describe('given a distribution table with invalid map keys', () => {
            it('throws', () => {
                // @ts-expect-error
                assert(() => { createProbability(new Map([[ 'bad', 'panda' ]])); })
                    .throws('distributionTable key "bad" must be an integer in createProbability()');
            });
        });

        describe('given a distribution table with an out of bounds probability', () => {
            describe('given a map key less than 1', () => {
                it('throws', () => {
                    assert(() => {
                        createProbability(new Map([
                            [ -10,  'backpack' ],
                            [ 50, 'belt pouch' ],
                        ]));
                    }).throws('distributionTable key "-10" must be 0 or greater in createProbability()');
                });
            });

            describe('given a map key greater than `100`', () => {
                it('throws', () => {
                    assert(() => {
                        createProbability(new Map([
                            [ 1,  'backpack' ],
                            [ 102, 'belt pouch' ],
                        ]));
                    }).throws('distributionTable key "102" exceeds 100 in createProbability()');
                });
            });
        });
    });

    describe('roll()', () => {
        it('returns a number', () => {
            assert(roll()).isNumber();
        });

        describe('given a float for `min`', () => {
            it('throws', () => {
                assert(() => { roll(3.1415); })
                    .throws('min must be an integer in roll()');
            });
        });

        describe('given a float for max', () => {
            it('throws', () => {
                assert(() => { roll(0, 3.1415); })
                    .throws('max must be an integer in roll()');
            });
        });

        describe('given a negative min', () => {
            it('throws', () => {
                assert(() => { roll(-100); })
                    .throws('min cannot be negative in roll()');
            });
        });

        describe('given a min that is greater than max', () => {
            it('throws', () => {
                assert(() => { roll(100, 20); })
                    .throws('min must less than or equal to max in roll()');
            });
        });

        describe('given the same min and max', () => {
            it('throws', () => {
                assert(roll(10, 10)).equals(10);
            });
        });

        describe('given a min and a max', () => {
            it('returns an integer between min and max, inclusive', () => {
                assert(roll(1, 3)).isInArray([1, 2, 3]);
            });
        });
    });

    describe('rollArrayItem()', () => {
        describe('given an array with a single item', () => {
            it('returns the item', () => {
                assert(rollArrayItem([ '20' ])).equals('20');
            });
        });

        describe('given an array with multiple items', () => {
            it('returns one of the item', () => {
                const options = [ 'cats', 'turtles', 'chickens' ];
                assert(rollArrayItem(options)).isInArray(options);
            });
        });

        describe('given no value', () => {
            it('throws', () => {
                // @ts-expect-error
                assert(() => { rollArrayItem(); })
                    .throws('Invalid array in rollArrayItem()');
            });
        });

        describe('given an empty array', () => {
            it('throws', () => {
                assert(() => { rollArrayItem([]); })
                    .throws('array must have values in rollArrayItem()');
            });
        });
    });

    describe('rollPercentile()', () => {
        describe('given a float', () => {
            it('throws', () => {
                assert(() => { rollPercentile(3.1415); })
                    .throws('chance must be an integer in rollPercentile()');
            });
        });

        describe('given an integer less than 0', () => {
            it('throws', () => {
                assert(() => { rollPercentile(-5); })
                    .throws('chance must be 0 or greater in rollPercentile()');
            });
        });

        describe('given an integer greater than 100', () => {
            it('throws', () => {
                assert(() => { rollPercentile(216); })
                    .throws('chance cannot exceed 100 in rollPercentile()');
            });
        });

        describe('given 0', () => {
            it('returns false', () => {
                assert(rollPercentile(0)).isFalse();
            });
        });

        describe('given 100', () => {
            it('returns true', () => {
                assert(rollPercentile(100)).isTrue();
            });
        });

        describe('given an integer between 0 and 100', () => {
            it('returns a boolean', () => {
                assert(rollPercentile(2)).isBoolean();
            });
        });
    });

};
