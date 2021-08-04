// @ts-check

import {
    // Private Functions
    testRollRoomType   as rollRoomType,
    testRollUniformity as rollUniformity,

    // Public Functions
    applyRoomRandomization,
} from '../settings.js';

import { furnitureQuantity } from '../../items/types/furnishing.js';
import { knobs } from '../../knobs.js';
import { list as conditions } from '../../attributes/condition.js';
import { list as rarities } from '../../attributes/rarity.js';
import { list as sizes } from '../../attributes/size.js';
import { random } from '../../utility/random.js';
import quantity, { quantities } from '../../attributes/quantity.js';
import roomType, { list as roomTypes } from '../type.js';

/**
 * @param {import('../../unit/state.js').Utility} utility
 */
export default ({ assert, describe, it }) => {

    // -- Private Functions ----------------------------------------------------

    describe('rollRoomType()', () => {
        describe('given a room type other than `random`', () => {
            it('should return it', () => {
                assert(rollRoomType(roomType.smithy)).equals(roomType.smithy);
            });
        });

        describe('given a room type of `random`', () => {
            it('should return a random room type', () => {
                assert(roomType[rollRoomType(random)] !== undefined).isTrue();
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
                    // TODO
                    [knobs.itemCondition]: random,
                    [knobs.itemQuantity]: random,
                    [knobs.itemRarity]: random,
                    [knobs.roomCondition]: random,
                    [knobs.roomFurnishing]: random,
                    [knobs.roomSize]: random,
                    [knobs.roomType]: random,
                });

                assert(roomConfig).isObject();

                assert([ ...conditions, random ].includes(roomConfig[knobs.itemCondition])).isTrue();
                assert(conditions.includes(roomConfig[knobs.roomCondition])).isTrue();
                assert(Object.keys(furnitureQuantity).includes(roomConfig[knobs.roomFurnishing])).isTrue();
                assert(quantities.includes(roomConfig[knobs.itemQuantity])).isTrue();
                assert([ ...rarities, random ].includes(roomConfig[knobs.itemRarity])).isTrue();
                assert(roomTypes.includes(roomConfig[knobs.roomType])).isTrue();
                assert(sizes.includes(roomConfig[knobs.roomSize])).isTrue();
            });

            describe('given a room type of `roomType.hallway` and an item quantity of `quantity.numerous`', () => {
                it('should limit the item quantity to `quantity.several`', () => {
                    const roomConfig = applyRoomRandomization({
                        // TODO
                        [knobs.itemQuantity]: quantity.numerous,
                        [knobs.roomType]: roomType.hallway,
                    });

                    assert(roomConfig[knobs.itemQuantity]).equals(quantity.several);
                });
            });
        });
    });
};
