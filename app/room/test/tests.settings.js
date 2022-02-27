// @ts-check

import {
    // Private Functions
    testRollRoomType   as rollRoomType,
    testRollUniformity as rollUniformity,

    // Public Functions
    applyRoomRandomization,
} from '../settings.js';

import { conditions } from '../../attribute/condition.js';
import { furnitureQuantities } from '../../item/furnishing.js';
import { quantities } from '../../attribute/quantity.js';
import { rarities } from '../../attribute/rarity.js';
import { roomTypes } from '../room.js';
import { sizes } from '../../attribute/size.js';

/**
 * @param {import('../../unit/state.js').Utility} utility
 */
export default ({ assert, describe, it }) => {

    // -- Private Functions ----------------------------------------------------

    describe('rollRoomType()', () => {
        describe('given a room type other than "random"', () => {
            it('should return it', () => {
                assert(rollRoomType('smithy')).equals('smithy');
            });
        });

        describe('given a room type of `random`', () => {
            it('should return a random room type', () => {
                assert(roomTypes.includes(rollRoomType('random'))).isTrue();
            });
        });
    });

    describe('rollUniformity()', () => {
        const fakeProbability = { roll: () => 'fake result', description: 'fake' };

        describe('given a uniformity condition of 100%', () => {
            it('should call roll() on the probability object', () => {
                const result = rollUniformity(100, fakeProbability);
                assert(result).equals('fake result');
            });
        });

        describe('given a uniformity condition of 0%', () => {
            it('should return undefined', () => {
                assert(rollUniformity(0, fakeProbability)).isUndefined();
            });
        });
    });

    // -- Public Functions -----------------------------------------------------

    describe('applyRoomRandomization()', () => {
        describe('given a `KnobSettings` object', () => {
            it('should return a `RoomConfig` object', () => {
                const roomConfig = applyRoomRandomization({
                    itemCondition        : 'random',
                    itemQuantity         : 'random',
                    itemRarity           : 'random',
                    roomCondition        : 'random',
                    roomFurnitureQuantity: 'random',
                    roomSize             : 'random',
                    roomType             : 'random',
                });

                assert(roomConfig).isObject();

                assert([ ...conditions, 'random' ].includes(roomConfig.itemCondition)).isTrue();
                assert(conditions.includes(roomConfig.roomCondition)).isTrue();
                assert(furnitureQuantities.includes(roomConfig.roomFurnitureQuantity)).isTrue();
                assert(quantities.includes(roomConfig.itemQuantity)).isTrue();
                assert([ ...rarities, 'random' ].includes(roomConfig.itemRarity)).isTrue();
                assert(roomTypes.includes(roomConfig.roomType)).isTrue();
                assert(sizes.includes(roomConfig.roomSize)).isTrue();
            });

            describe('given a room type of "hallway" and an item quantity of `quantity.numerous`', () => {
                it('should limit the item quantity to `quantity.several`', () => {
                    const roomConfig = applyRoomRandomization({
                        itemQuantity: 'numerous',
                        roomType    : 'hallway',
                    });

                    assert(roomConfig.itemQuantity).equals('several');
                });
            });
        });
    });
};
