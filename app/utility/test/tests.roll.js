
import {
    roll,
} from '../roll.js';

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
            it('should return a number between `min` and `max`, inclusive', () => {
                let result = roll(1, 3);
                assert([1, 2, 3].includes(result)).isTrue();
            });
        });
    });
};
