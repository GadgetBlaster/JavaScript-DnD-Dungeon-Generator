// @ts-check

import {
    generateRooms,
} from '../generate.js';

import { furnitureQuantity } from '../../items/types/furnishing.js';
import { knobs } from '../../knobs.js';
import condition from '../../attributes/condition.js';
import itemType from '../../items/type.js';
import quantity from '../../attributes/quantity.js';
import rarity from '../../attributes/rarity.js';
import roomType from '../type.js';
import size from '../../attributes/size.js';

/**
 * @param {import('../../unit/state.js').Utility} utility
 */
export default ({ assert, describe, it }) => {
    describe('generateRooms()', () => {
        const config = {
            // TODO
            [knobs.itemCondition]: condition.average,
            [knobs.itemQuantity]: quantity.zero,
            [knobs.itemRarity]: rarity.exotic,
            [knobs.itemType]: itemType.treasure,
            [knobs.roomCondition]: condition.average,
            [knobs.roomCount]: 1,
            [knobs.roomSize]: size.medium,
            [knobs.roomType]: roomType.room,
            [knobs.roomFurnishing]: furnitureQuantity.none,
        };

        describe('required configs', () => {
            [
                'roomCondition',
                'roomCount',
                'roomSize',
                'roomType',
            ].forEach((requiredConfig) => {
                describe(`given no \`${requiredConfig}\``, () => {
                    const incompleteConfig = { ...config };
                    delete incompleteConfig[requiredConfig];

                    it('should throw', () => {
                        // @ts-expect-error
                        assert(() => generateRooms(incompleteConfig))
                            .throws(`${requiredConfig} is required in generateRooms()`);
                    });
                });
            });

            describe('given a `roomCount` of 2', () => {
                it('should return an array with 2 `Room`s', () => {
                    const rooms = generateRooms({
                        ...config,
                        [knobs.roomCount]: 2,
                    });

                    assert(rooms).isArray();
                    assert(rooms.length).equals(2);

                    rooms && rooms.forEach((roomConfig) => {
                        assert(roomConfig.settings).isObject();
                        assert(roomConfig.items).isArray();
                    });
                });
            });

            describe('given a `knobs.itemQuantity` of `quantity.couple`', () => {
                it('should return an array of `Room` objects with two items', () => {
                    const rooms = generateRooms({
                        // TODO
                        ...config,
                        [knobs.itemQuantity]: quantity.couple,
                    }).pop();

                    assert(rooms.items[0]).stringIncludes('Items (2)');
                });

                describe('given a `roomFurnishing` of `furnishing.minimum`', () => {
                    it('should return an array of `Room` objects with three items', () => {
                        const rooms = generateRooms({
                            // TODO
                            ...config,
                            [knobs.itemQuantity]: quantity.couple,
                            [knobs.roomFurnishing]: furnitureQuantity.minimum,
                        }).pop();

                        assert(rooms.items[0]).stringIncludes('Items (3)');
                    });
                });
            });
        });
    });
};

