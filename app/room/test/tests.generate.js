// @ts-check

import {
    generateRooms,
} from '../generate.js';

import { furnitureQuantity } from '../../item/furnishing.js';

/**
 * @param {import('../../unit/state.js').Utility} utility
 */
export default ({ assert, describe, it }) => {
    describe('generateRooms()', () => {
        const config = {
            itemCondition : 'average',
            itemQuantity  : 'zero',
            itemRarity    : 'exotic',
            itemType      : 'treasure',
            roomCondition : 'average',
            roomCount     : 1,
            roomSize      : 'medium',
            roomType      : 'room',
            roomFurnishing: furnitureQuantity.none,
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
                        roomCount: 2,
                    });

                    assert(rooms).isArray();
                    assert(rooms.length).equals(2);

                    rooms && rooms.forEach((roomConfig) => {
                        assert(roomConfig.settings).isObject();
                        assert(roomConfig.items).isArray();
                    });
                });
            });

            describe('given a `knobs.itemQuantity` of "couple"', () => {
                it('should return an array of `Room` objects with two items', () => {
                    const rooms = generateRooms({
                        ...config,
                        itemQuantity: 'couple',
                    }).pop();

                    assert(rooms.items[0]).stringIncludes('Items (2)');
                });

                describe('given a `roomFurnishing` of `furnishing.minimum`', () => {
                    it('should return an array of `Room` objects with three items', () => {
                        const rooms = generateRooms({
                            ...config,
                            itemQuantity  : 'couple',
                            roomFurnishing: furnitureQuantity.minimum,
                        }).pop();

                        assert(rooms.items[0]).stringIncludes('Items (3)');
                    });
                });
            });
        });
    });
};

