
import {
    applyRoomRandomization,
} from '../settings.js';

import { knobs } from '../../knobs.js';
import roomType, { list as roomTypes } from '../type.js';
import { list as sizes } from '../../attributes/size.js';
import { random } from '../../utility/random.js';
import { furnitureQuantity } from '../../items/types/furnishing.js';
import quantity, { quantities } from '../../attributes/quantity.js';
import { list as conditions } from '../../attributes/condition.js';
import { list as rarities } from '../../attributes/rarity.js';

/**
 * @param {import('../../../unit/unit.js').Utility}
 */
export default ({ assert, describe, it }) => {
    describe('applyRoomRandomization()', () => {
        describe('given a `KnobSettings` object', () => {
            it('should return a `RoomConfig` object', () => {
                let roomConfig = applyRoomRandomization({
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
                    let roomConfig = applyRoomRandomization({
                        [knobs.itemQuantity]: quantity.numerous,
                        [knobs.roomType]: roomType.hallway,
                    });

                    assert(roomConfig[knobs.itemQuantity]).equals(quantity.several);
                });
            });
        });
    });
};
