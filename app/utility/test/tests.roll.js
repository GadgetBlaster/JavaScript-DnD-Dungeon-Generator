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
    describe('createProbability()', () => {
        describe('given a valid `config`', () => {
            const probability = createProbability([[ 23, 'boats' ]]);

            it('should return an object`', () => {
                assert(probability).isObject();
            });

            describe('return object properties', () => {
                it('should return an object with a string property `description`', () => {
                    assert(probability.description).isString();
                });

                it('should return an object with a function property `roll`', () => {
                    assert(probability.roll).isFunction();
                });
            });
        });

        describe('return `description`', () => {
            const probability = createProbability([
                [ 23, 'boats' ],
                [ 55, 'horses' ],
            ]);

            it('should include the probability range and value for each `config` entry', () => {
                assert(probability.description)
                    .stringIncludes('1-23% boats')
                    .stringIncludes('24-55% horses');
            });
        });

        describe('return `roll`', () => {
            const probability = createProbability([
                [ 50,  'potion of healing' ],
                [ 100, 'potion of love' ],
            ]);

            it('should return one of the values in the `config`', () => {
                const result = probability.roll();
                assert([ 'potion of healing', 'potion of love' ].includes(result)).isTrue();
            });
        });

        it('should return an object`', () => {
            assert(createProbability([[ 23, 'boats' ]])).isObject();
        });

        describe('given a `config` that is not an array', () => {
            it('should throw', () => {
                // @ts-expect-error
                assert(() => { createProbability('junk'); })
                    .throws('Probability `config` must be an array');
            });
        });

        describe('given an empty `config`', () => {
            it('should throw', () => {
                assert(() => { createProbability([]); })
                    .throws('Probability config must have values');
            });
        });

        describe('given a `config` that is not a 2 dimensional array', () => {
            it('should throw', () => {
                // @ts-expect-error
                assert(() => { createProbability([ 'junk' ]); })
                    .throws('Invalid `config` for Map');
            });
        });

        describe('given a `config` with invalid map keys', () => {
            it('should throw', () => {
                // @ts-expect-error
                assert(() => { createProbability([[ 'bad', 'panda' ]]); })
                    .throws('Probability key "bad" must be an integer');
            });
        });

        describe('given a `config` with invalid map values', () => {
            it('should throw', () => {
                // @ts-expect-error
                assert(() => { createProbability([[ 23, 99 ]]); })
                    .throws('Probability value "99" must be a string');
            });
        });

        describe('given a `config` with an out of bounds probability', () => {
            describe('given a map key less than `1`', () => {
                it('should throw', () => {
                    assert(() => {
                        createProbability([
                            [ -10,  'backpack' ],
                            [ 50, 'belt pouch' ],
                        ]);
                    }).throws('Probability key "-10" must be 0 or greater');
                });
            });

            describe('given a map key greater than `100`', () => {
                it('should throw', () => {
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
        it('should return a number', () => {
            assert(roll()).isNumber();
        });

        describe('given a float for `min`', () => {
            it('should throw', () => {
                assert(() => { roll(3.1415); })
                    .throws('Roll `min` must be an integer');
            });
        });

        describe('given a float for `max`', () => {
            it('should throw', () => {
                assert(() => { roll(0, 3.1415); })
                    .throws('Roll `max` must be an integer');
            });
        });

        describe('given a negative `min`', () => {
            it('should throw', () => {
                assert(() => { roll(-100); })
                    .throws('Roll `min` cannot be negative');
            });
        });

        describe('given a `min` that is greater than `max`', () => {
            it('should throw', () => {
                assert(() => { roll(100, 20); })
                    .throws('Roll `min` must less than or equal to `max`');
            });
        });

        describe('given the same `min` and `max`', () => {
            it('should throw', () => {
                assert(roll(10, 10)).equals(10);
            });
        });

        describe('given a `min` and a `max`', () => {
            it('should return an integer between `min` and `max`, inclusive', () => {
                const result = roll(1, 3);
                assert([1, 2, 3].includes(result)).isTrue();
            });
        });
    });

    describe('rollArrayItem()', () => {
        describe('given an array with a single item', () => {
            it('should return the item', () => {
                assert(rollArrayItem([ '20' ])).equals('20');
            });
        });

        describe('given an array with multiple items', () => {
            it('should return one of the item', () => {
                const options = [ 'cats', 'turtles', 'chickens' ];
                const result  = rollArrayItem(options);

                assert((options.includes(result))).isTrue();
            });
        });

        describe('given no value', () => {
            it('should throw', () => {
                // @ts-expect-error
                assert(() => { rollArrayItem(); })
                    .throws('Invalid roll array');
            });
        });

        describe('given an empty array', () => {
            it('should throw', () => {
                assert(() => { rollArrayItem([]); })
                    .throws('Roll array must have values');
            });
        });
    });

    describe('rollPercentile()', () => {
        describe('given a float', () => {
            it('should throw', () => {
                assert(() => { rollPercentile(3.1415); })
                    .throws('rollPercentile() chance must be an integer');
            });
        });

        describe('given an integer less than 0', () => {
            it('should throw', () => {
                assert(() => { rollPercentile(-5); })
                    .throws('rollPercentile() chance must be 0 or greater');
            });
        });

        describe('given an integer greater than 100', () => {
            it('should throw', () => {
                assert(() => { rollPercentile(216); })
                    .throws('rollPercentile() chance cannot exceed 100');
            });
        });

        describe('given 0', () => {
            it('should return false', () => {
                assert(rollPercentile(0)).isFalse();
            });
        });

        describe('given 100', () => {
            it('should return true', () => {
                assert(rollPercentile(100)).isTrue();
            });
        });

        describe('given an integer between 0 and 100', () => {
            it('should return a boolean', () => {
                assert(rollPercentile(2)).isBoolean();
            });
        });
    });
};
