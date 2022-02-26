// @ts-check

import {
    // Private Functions
    testGroupByRarity as groupByRarity,
    testGroupByType   as groupByType,

    // Public Functions
    generateItem,
} from '../item.js';

/**
 * @param {import('../../unit/state.js').Utility}
 */
export default ({ assert, describe, it }) => {

    // -- Private Constants ----------------------------------------------------

    // TODO assert on rarity and type sets
    // describe('`groupByRarity`', () => {
    //     it('should contain an entry for each rarity', () => {
    //         let rarityKeys = Object.keys(groupByRarity);

    //         assert(rarityKeys.length).equals(rarities.length);
    //         assert(rarityKeys.find((rarity) => !rarities.includes(rarity)))
    //             .isUndefined();
    //     });
    // });

    // describe('`groupByType`', () => {
    //     it('should contain an entry for each item type', () => {
    //         let typeKeys = Object.keys(groupByType);

    //         assert(typeKeys.length).equals(itemTypes.length);
    //         assert(typeKeys.find((rarity) => !itemTypes.includes(rarity)))
    //             .isUndefined();
    //     });

    //     it('should contain an entry for each rarity for each item type', () => {
    //         Object.values(groupByType).forEach((typeGroup) => {
    //             let rarityKeys = Object.keys(typeGroup);

    //             assert(rarityKeys.length).equals(rarities.length);
    //             assert(rarityKeys.find((rarity) => !rarities.includes(rarity)))
    //                 .isUndefined();
    //         });
    //     });
    // });

    // -- Public Functions -----------------------------------------------------

    // TODO incomplete test coverage
    describe('generateItem()', () => {
        const itemSettings = {
            itemCondition: 'average',
            itemQuantity : 'one',
            itemRarity   : 'exotic',
            itemType     : 'treasure',
        };

        describe('given no `itemCondition` setting', () => {
            it('should throw', () => {
                let settings = { ...itemSettings };
                delete settings.itemCondition;
                assert(() => generateItem(settings)).throws('Item condition is required in generateItem()');
            });
        });

        describe('given no `itemQuantity` setting', () => {
            it('should throw', () => {
                let settings = { ...itemSettings };
                delete settings.itemQuantity;
                assert(() => generateItem(settings)).throws('Item quantity is required in generateItem()');
            });
        });

        describe('given an `itemQuantity` of zero', () => {
            it('should throw', () => {
                let settings = { ...itemSettings };
                settings.itemQuantity = 'zero';
                assert(() => generateItem(settings)).throws('Item quantity cannot be zero');
            });
        });

        describe('given no `itemRarity` setting', () => {
            it('should throw', () => {
                let settings = { ...itemSettings };
                delete settings.itemRarity;
                assert(() => generateItem(settings)).throws('Item rarity is required in generateItem()');
            });
        });

        describe('given no `itemQuantity` setting', () => {
            it('should throw', () => {
                let settings = { ...itemSettings };
                delete settings.itemType;
                assert(() => generateItem(settings)).throws('Item type is required in generateItem()');
            });
        });

        it('should return an item config', () => {
            let item = generateItem(itemSettings);

            assert(item.label).isString();
            assert(item.name).isString();
            assert(item.quantity).equals(1); // TODO count
        });
    });
};
