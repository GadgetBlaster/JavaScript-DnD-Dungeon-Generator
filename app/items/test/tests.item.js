
import {
    _private,
    generateItem,
} from '../item.js';
import { knobs } from '../../knobs.js';

import { list as rarities } from '../../attributes/rarity.js';
import itemType, { list as itemTypes } from '../type.js';
import condition from '../../attributes/condition.js';
import quantity from '../../attributes/quantity.js';
import rarity from '../../attributes/rarity.js';


const {
    groupByRarity,
    groupByType,
} = _private;

/**
 * @param {import('../../unit/state.js').Utility}
 */
export default ({ assert, describe, it }) => {

    // -- Private Constants ----------------------------------------------------

    describe('`groupByRarity`', () => {
        it('should contain an entry for each rarity', () => {
            let rarityKeys = Object.keys(groupByRarity);

            assert(rarityKeys.length).equals(rarities.length);
            assert(rarityKeys.find((rarity) => !rarities.includes(rarity)))
                .isUndefined();
        });
    });

    describe('`groupByType`', () => {
        it('should contain an entry for each item type', () => {
            let typeKeys = Object.keys(groupByType);

            assert(typeKeys.length).equals(itemTypes.length);
            assert(typeKeys.find((rarity) => !itemTypes.includes(rarity)))
                .isUndefined();
        });

        it('should contain an entry for each rarity for each item type', () => {
            Object.values(groupByType).forEach((typeGroup) => {
                let rarityKeys = Object.keys(typeGroup);

                assert(rarityKeys.length).equals(rarities.length);
                assert(rarityKeys.find((rarity) => !rarities.includes(rarity)))
                    .isUndefined();
            });
        });
    });

    // -- Public Functions -----------------------------------------------------

    describe('generateItem()', () => {
        const itemSettings = {
            [knobs.itemCondition]: condition.average,
            [knobs.itemQuantity]: quantity.zero,
            [knobs.itemRarity]: rarity.exotic,
            [knobs.itemType]: itemType.treasure,
            [knobs.roomCount]: 2,
        };

        describe('given no `itemCondition` setting', () => {
            let settings = { ...itemSettings };
            delete settings[knobs.itemCondition];

            it('should throw', () => {
                assert(() => generateItem(settings)).throws('Item condition is required in generateItem()');
            });
        });

        describe('given no `itemQuantity` setting', () => {
            let settings = { ...itemSettings };
            delete settings[knobs.itemQuantity];

            it('should throw', () => {
                assert(() => generateItem(settings)).throws('Item quantity is required in generateItem()');
            });
        });

        describe('given no `itemQuantity` setting', () => {
            let settings = { ...itemSettings };
            delete settings[knobs.itemRarity];

            it('should throw', () => {
                assert(() => generateItem(settings)).throws('Item rarity is required in generateItem()');
            });
        });

        describe('given no `itemQuantity` setting', () => {
            let settings = { ...itemSettings };
            delete settings[knobs.itemType];

            it('should throw', () => {
                assert(() => generateItem(settings)).throws('Item type is required in generateItem()');
            });
        });
    });
};
