
import {
    _generateItemObjects,
    _getItemCount,
} from '../generate.js';

import { knobs } from '../../knobs.js';
import { random } from '../../utility/random.js';
import condition from '../../attributes/condition.js';
import itemType from '../type.js';
import quantity, { quantityMinimum, quantityMaximum } from '../../attributes/quantity.js';
import rarity from '../../attributes/rarity.js';

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
        describe('given a count of 1', () => {
            let items = _generateItemObjects(1, {
                [knobs.itemCondition]: random,
                [knobs.itemQuantity] : quantity.one,
                [knobs.itemRarity]   : random,
                [knobs.itemType]     : random,
            });

            let entries = Object.entries(items);
            let [ key, item ] = [ ...entries ].pop();

            it('should return an object with a single item', () => {
                assert(items).isObject();
                assert(entries.length).equals(1);
                assert(item).isObject();
            });

            it('should return an object keyed by the item\'s label', () => {
                assert(key).equals(item.label);
            });
        });

        describe('given a count greater than 1', () => {
            let items = _generateItemObjects(3, {
                [knobs.itemCondition]: random,
                [knobs.itemQuantity] : quantity.one,
                [knobs.itemRarity]   : random,
                [knobs.itemType]     : random,
            });

            let entries = Object.entries(items);

            it('should return an object keyed by the item\'s labels', () => {
                let invalidKeys = entries.find(([ key, item ]) => key !== item.label);
                assert(invalidKeys).isUndefined();
            });
        });

        describe('when duplicates of the same item are generated', () => {
            let items = _generateItemObjects(3, {
                [knobs.itemCondition]: condition.average,
                [knobs.itemQuantity] : quantity.one,
                [knobs.itemRarity]   : rarity.common,
                [knobs.itemType]     : itemType.mysterious,
            });

            let entries = Object.entries(items);
            let [ key, item ] = [ ...entries ].pop();

            it('should return an object keyed by the item\'s labels', () => {
                assert(key).equals(item.label);
            });

            it('should return an item object with a count of duplicates', () => {
                assert(item.count).equals(3);
            });
        });
    });
};