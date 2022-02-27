// @ts-check

import {
    // Private Constants
    itemsByRarity,
    itemsByType,
} from '../item.js';

/**
 * @param {import('../../unit/state.js').Utility} utility
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

};
