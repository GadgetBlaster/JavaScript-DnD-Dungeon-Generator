
import {
    roll,
} from '../roll.js';

export default ({ assert, describe, it }) => {
    describe('#roll', () => {
        it('should return a number', () => {
            assert(roll()).isNumber();
        });

        describe('given a float', () => {
            it('should throw', () => {
                assert(roll(3.1415)).throws();
            });
        });
    });
};
