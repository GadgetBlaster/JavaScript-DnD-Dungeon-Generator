// @ts-check

import {
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
        describe('given a valid `config`', () => {
            const probability = createProbability([[ 23, 'boats' ]]);

            it('returns an object`', () => {
                assert(probability).isObject();
            });

            describe('return object properties', () => {
                it('returns an object with a string property `description`', () => {
                    assert(probability.description).isString();
                });

                it('returns an object with a function property `roll`', () => {
                    assert(probability.roll).isFunction();
                });
            });
        });

        describe('probability description', () => {
            const probability = createProbability([
                [ 23, 'boats' ],
                [ 55, 'horses' ],
            ]);

            it('includes the probability range and value for each `config` entry', () => {
                assert(probability.description)
                    .stringIncludes('1-23% boats')
                    .stringIncludes('24-55% horses');
            });
        });

        describe('roll()', () => {
            const probability = createProbability([
                [ 50,  'potion of healing' ],
                [ 100, 'potion of love' ],
            ]);

            it('returns one of the values in the `config`', () => {
                const result = probability.roll();
                assert([ 'potion of healing', 'potion of love' ].includes(result)).isTrue();
            });
        });

        it('returns an object', () => {
            assert(createProbability([[ 23, 'boats' ]])).isObject();
        });

        describe('given a `config` that is not an array', () => {
            it('throws', () => {
                // @ts-expect-error
                assert(() => { createProbability('junk'); })
                    .throws('Probability `config` must be an array');
            });
        });

        describe('given an empty `config`', () => {
            it('throws', () => {
                assert(() => { createProbability([]); })
                    .throws('Probability config must have values');
            });
        });

        describe('given a `config` that is not a 2 dimensional array', () => {
            it('throws', () => {
                // @ts-expect-error
                assert(() => { createProbability([ 'junk' ]); })
                    .throws('Invalid `config` for Map in `createProbability()`');
            });
        });

        describe('given a `config` with invalid map keys', () => {
            it('throws', () => {
                // @ts-expect-error
                assert(() => { createProbability([[ 'bad', 'panda' ]]); })
                    .throws('Probability key "bad" must be an integer');
            });
        });

        describe('given a `config` with invalid map values', () => {
            it('throws', () => {
                // @ts-expect-error
                assert(() => { createProbability([[ 23, 99 ]]); })
                    .throws('Probability value "99" must be a string');
            });
        });

        describe('given a `config` with an out of bounds probability', () => {
            describe('given a map key less than `1`', () => {
                it('throws', () => {
                    assert(() => {
                        createProbability([
                            [ -10,  'backpack' ],
                            [ 50, 'belt pouch' ],
                        ]);
                    }).throws('Probability key "-10" must be 0 or greater');
                });
            });

            describe('given a map key greater than `100`', () => {
                it('throws', () => {
                    assert(() => {
                        createProbability([
                            [ 1,  'backpack' ],
                            [ 102, 'belt pouch' ],
                        ]);
                    }).throws('Probability key "102" exceeds 100');
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
                    .throws('Roll `min` must be an integer');
            });
        });

        describe('given a float for `max`', () => {
            it('throws', () => {
                assert(() => { roll(0, 3.1415); })
                    .throws('Roll `max` must be an integer');
            });
        });

        describe('given a negative `min`', () => {
            it('throws', () => {
                assert(() => { roll(-100); })
                    .throws('Roll `min` cannot be negative');
            });
        });

        describe('given a `min` that is greater than `max`', () => {
            it('throws', () => {
                assert(() => { roll(100, 20); })
                    .throws('Roll `min` must less than or equal to `max`');
            });
        });

        describe('given the same `min` and `max`', () => {
            it('throws', () => {
                assert(roll(10, 10)).equals(10);
            });
        });

        describe('given a `min` and a `max`', () => {
            it('returns an integer between `min` and `max`, inclusive', () => {
                const result = roll(1, 3);
                assert([1, 2, 3].includes(result)).isTrue();
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
                const result  = rollArrayItem(options);

                assert((options.includes(result))).isTrue();
            });
        });

        describe('given no value', () => {
            it('throws', () => {
                // @ts-expect-error
                assert(() => { rollArrayItem(); })
                    .throws('Invalid roll array');
            });
        });

        describe('given an empty array', () => {
            it('throws', () => {
                assert(() => { rollArrayItem([]); })
                    .throws('Roll array must have values');
            });
        });
    });

    describe('rollPercentile()', () => {
        describe('given a float', () => {
            it('throws', () => {
                assert(() => { rollPercentile(3.1415); })
                    .throws('rollPercentile() chance must be an integer');
            });
        });

        describe('given an integer less than 0', () => {
            it('throws', () => {
                assert(() => { rollPercentile(-5); })
                    .throws('rollPercentile() chance must be 0 or greater');
            });
        });

        describe('given an integer greater than 100', () => {
            it('throws', () => {
                assert(() => { rollPercentile(216); })
                    .throws('rollPercentile() chance cannot exceed 100');
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
