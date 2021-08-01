// @ts-check

import {
    generateRooms,
} from '../generate.js';

import { knobs } from '../../knobs.js';
import itemType from '../../items/type.js';
import quantity from '../../attributes/quantity.js';
import rarity from '../../attributes/rarity.js';
import condition from '../../attributes/condition.js';

/**
 * @param {import('../../unit/state.js').Utility} utility
 */
export default ({ assert, describe, it }) => {
    describe('generateRooms()', () => {
        describe('given a `KnobSettings` object', () => {
            describe('given a `knobs.roomCount` of 2', () => {
                it('should return an array with 2 `RoomConfig`s', () => {
                    const roomConfigs = generateRooms({
                        // TODO
                        [knobs.itemCondition]: condition.average,
                        [knobs.itemQuantity]: quantity.zero,
                        [knobs.itemRarity]: rarity.exotic,
                        [knobs.itemType]: itemType.treasure,
                        [knobs.roomCount]: 2,
                    });

                    assert(roomConfigs).isArray();
                    assert(roomConfigs.length).equals(2);

                    roomConfigs.forEach((roomConfig) => {
                        assert(roomConfig.settings).isObject();
                        assert(roomConfig.items).isArray();
                    });
                });
            });

            describe('given a `knobs.itemQuantity` of `quantity.couple`', () => {
                it('should return a `RoomConfig` with two items', () => {
                    const roomConfig = generateRooms({
                        // TODO
                        [knobs.itemCondition]: condition.average,
                        [knobs.itemQuantity]: quantity.couple,
                        [knobs.itemRarity]: rarity.exotic,
                        [knobs.itemType]: itemType.treasure,
                        [knobs.roomCount]: 1,
                    }).pop();

                    assert(roomConfig.items[0]).stringIncludes('Items (2)');
                });
            });
        });
    });
};

