
import quantity, { quantityMinimum, quantityMaximum } from '../../attributes/quantity.js';
import {
    _getItemCount,
} from '../generate.js';

/**
 * @param {import('../../../unit/unit.js').Utility}
 */
export default ({ assert, describe, it }) => {
    describe('_getItemCount()', () => {
        describe('given a quantity of `quantity.zero`', () => {
            it('should return 0', () => {
                assert(_getItemCount(quantity.zero)).equals(0);
            });
        });

        describe('given a quantity of `quantity.one`', () => {
            it('should return 1', () => {
                assert(_getItemCount(quantity.one)).equals(1);
            });
        });

        describe('given a quantity of `quantity.few`', () => {
            it('should return a value between `quantityMinimum.numerous` and `quantityMinimum.some` ', () => {
                let count     = _getItemCount(quantity.few);
                let isInRange = count >= quantityMinimum.few && count < quantityMinimum.some;

                assert(isInRange).isTrue();
            });
        });

        describe('given a quantity of `quantity.numerous`', () => {
            it('should return a value between `quantityMinimum.numerous` and `quantityMaximum` ', () => {
                let count     = _getItemCount(quantity.numerous);
                let isInRange = count >= quantityMinimum.numerous && count < quantityMaximum;

                assert(isInRange).isTrue();
            });
        });
    });

    describe('_generateItemObjects()', () => {

    });
};