
import {
    roll,
    rollArrayItem,
    rollPercentile,
} from '../roll.js';

/**
 * @param {import('../../../unit/unit.js').Utility}
 */
export default ({ assert, describe, it }) => {
    describe('#roll', () => {
        it('should return a number', () => {
            assert(roll()).isNumber();
        });

        describe('given a float for `min`', () => {
            it('should throw', () => {
                assert(() => { roll(3.1415); }).throws();
            });
        });

        describe('given a float for `max`', () => {
            it('should throw', () => {
                assert(() => { roll(0, 3.1415); }).throws();
            });
        });

        describe('given a negative `min`', () => {
            it('should throw', () => {
                assert(() => { roll(-100); }).throws();
            });
        });

        describe('given a `min` that is greater than `max`', () => {
            it('should throw', () => {
                assert(() => { roll(100, 20); }).throws();
            });
        });

        describe('given the same `min` and `max`', () => {
            it('should throw', () => {
                assert(roll(10, 10)).equals(10);
            });
        });

        describe('given a `min` and a `max`', () => {
            it('should return an integer between `min` and `max`, inclusive', () => {
                let result = roll(1, 3);
                assert([1, 2, 3].includes(result)).isTrue();
            });
        });
    });

    describe('#rollArrayItem', () => {
        describe('given an array with a single item', () => {
            it('should return the item', () => {
                assert(rollArrayItem([ '20' ])).equals('20');
            });
        });

        describe('given an array with multiple items', () => {
            it('should return one of the item', () => {
                let options = [ 'cats', 'turtles' ];
                let result = rollArrayItem(options);
                assert((options.includes(result))).isTrue();
            });
        });

        describe('given no value', () => {
            it('should throw', () => {
                assert(() => { rollArrayItem(); }).throws();
            });
        });

        describe('given an empty array', () => {
            it('should throw', () => {
                assert(() => { rollArrayItem([]); }).throws();
            });
        });
    });
};
