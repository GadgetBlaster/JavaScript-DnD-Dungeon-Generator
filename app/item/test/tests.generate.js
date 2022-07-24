// @ts-check

import {
    // Private Functions
    testGenerateFurnishings  as generateFurnishings,
    testGenerateItem         as generateItem,
    testGenerateItemObjects  as generateItemObjects,
    testGetFurnishingObjects as getFurnishingObjects,
    testGetItemCount         as getItemCount,

    // Public Functions
    generateItems,
} from '../generate.js';

import { quantityRanges } from '../../attribute/quantity.js';
import {
    anyRoomFurniture,
    furnishingByRoomType,
    furnishingQuantityRanges,
    requiredRoomFurniture,
} from '../furnishing.js';

import { itemTypes } from '../item.js';
import { conditions } from '../../attribute/condition.js';
import { rarities } from '../../attribute/rarity.js';
import { sizes } from '../../attribute/size.js';

/** @typedef {import('../generate.js').Item} Item */
/** @typedef {import('../../controller/knobs').ItemConfig} ItemConfig */

/**
 * @param {import('../../unit/state.js').Utility} utility
 */
export default ({ assert, describe, it }) => {

    // -- Private Functions ----------------------------------------------------

    describe('generateFurnishings()', () => {
        it('should return an array', () => {
            const furniture = generateFurnishings('room', 'minimum');
            assert(furniture).isArray();
        });

        describe('given `none`', () => {
            it('should return an empty array', () => {
                const furniture = generateFurnishings('smithy', 'none');
                assert(furniture).isArray();
                assert(furniture.length).equals(0);
            });
        });

        describe('given a furniture quantity', () => {
            it('should generate a number of furniture items within the furniture quantity range', () => {
                // Make sure "room" is not included in
                // `requiredRoomFurniture`.
                assert(requiredRoomFurniture.room).isUndefined();

                const furniture = generateFurnishings('room', 'furnished');
                const count     = furniture.length;
                const max       = furnishingQuantityRanges.furnished;

                assert(count >= 1 && count <= max).isTrue();
            });
        });

        describe('given a `roomType` that requires furniture', () => {
            const furniture = generateFurnishings('smithy', 'minimum')
                .map(({ name }) => name);

            it('should return an array including all required room type furniture', () => {
                // Make sure "smithy" is still included in
                // `requiredRoomFurniture`.
                assert(requiredRoomFurniture.smithy).isArray();

                requiredRoomFurniture.smithy.forEach(({ name }) => {
                    assert(name).isInArray(furniture);
                });
            });
        });

        describe('given a room type included in `furnishingByRoomType`', () => {
            it('should include only furniture appropriate to the room type', () => {
                // Make sure "room" is still included in
                // `requiredRoomFurniture`.
                assert(furnishingByRoomType.room).isArray();

                const validFurniture = furnishingByRoomType.room.concat(anyRoomFurniture)
                    .map(({ name }) => name);

                generateFurnishings('room', 'furnished')
                    .forEach(({ name }) => {
                        assert(name).isInArray(validFurniture);
                    });
            });
        });

        describe('given a room type not included in `furnishingByRoomType`', () => {
            it('should include any furnishing', () => {
                // Make sure 'newRoomType' is not included in
                // `furnishingByRoomType`.
                assert(furnishingByRoomType.newRoomType).isUndefined();

                const furniture = generateFurnishings('newRoomType', 'minimum').pop();
                assert(furniture).isObject();
                furniture && assert(furniture.name).isString();
            });
        });
    });

    // TODO incomplete test coverage
    describe('generateItem()', () => {
        /** @type {ItemConfig} */
        const itemSettings = {
            itemCondition: 'average',
            itemQuantity : 'one',
            itemRarity   : 'exotic',
            itemType     : 'treasure',
        };

        it('returns an item config', () => {
            let item = generateItem(itemSettings);

            // TODO
            // * @prop {number} [capacity] - Max number of small items found inside
            // * @prop {string[]} [variants] - Array of variations

            assert(item.name).isString();
            assert(item.condition).isInArray(conditions);
            assert(item.rarity).isInArray(rarities);
            assert(item.size).isInArray(sizes);
            assert(item.type).isInArray(itemTypes);
            assert(item.count).equals(1);
        });

        describe('given no `itemCondition` setting', () => {
            it('should throw', () => {
                let settings = { ...itemSettings };

                // @ts-expect-error
                delete settings.itemCondition;
                assert(() => generateItem(settings)).throws('Item condition is required in generateItem()');
            });
        });

        describe('given no `itemQuantity` setting', () => {
            it('should throw', () => {
                let settings = { ...itemSettings };

                // @ts-expect-error
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

                // @ts-expect-error
                delete settings.itemRarity;
                assert(() => generateItem(settings)).throws('Item rarity is required in generateItem()');
            });
        });

        describe('given no `itemQuantity` setting', () => {
            it('should throw', () => {
                let settings = { ...itemSettings };

                // @ts-expect-error
                delete settings.itemType;
                assert(() => generateItem(settings)).throws('Item type is required in generateItem()');
            });
        });
    });

    describe('generateItemObjects()', () => {
        describe('given a count of 1', () => {
            const items = generateItemObjects(1, {
                itemCondition: 'random',
                itemQuantity : 'one',
                itemRarity   : 'random',
                itemType     : 'random',
            });

            it('return an array with a single item', () => {
                assert(items).isArray();
                assert(items.length).equals(1);

                const item = items[0];
                assert(item).isObject();
                assert(item.name).isString();
            });
        });

        describe('given a count greater than 1', () => {
            const items = generateItemObjects(3, {
                itemCondition: 'random',
                itemQuantity : 'one',
                itemRarity   : 'random',
                itemType     : 'random',
            });

            it('returns an array with item matching the count', () => {
                assert(items).isArray();
                assert(items.reduce((total, { count }) => total + count, 0)).equals(3);
            });
        });

        describe('when duplicates of the same item are generated', () => {
            const items = generateItemObjects(3, {
                itemCondition: 'average',
                itemQuantity : 'one',
                itemRarity   : 'common',
                itemType     : 'mysterious',
            });

            it('should return an array with the items consolidated', () => {
                assert(items).isArray();
                assert(items.length).equals(1);
            });

            it('should return an item object with a count of duplicates', () => {
                assert(items).isArray();
                assert(items[0].count).equals(3);
            });
        });
    });

    describe('getFurnishingObjects()', () => {
        /** @type {Item} table */
        const table = {
            condition: 'average',
            count: 1,
            name: 'Table',
            rarity: 'average',
            size: 'medium',
            type: 'furnishing',
        };

        describe('given a single furnishing object', () => {
            const furnishings = getFurnishingObjects([ table ]);

            it('returns an array with a single furnishing', () => {
                assert(furnishings).isArray();
                assert(furnishings.length).equals(1);

                const furnishing = furnishings[0];
                assert(furnishing).isObject();
                assert(furnishing.name).equals('Table');
            });
        });

        describe('given multiple furnishing objects', () => {
            const chair = {
                ...table,
                name: 'Chair',
                label: 'Chair',
            };

            const furnishings = getFurnishingObjects([ table, chair ]);

            it('return an array of furnishings for the given items', () => {
                assert(furnishings).isArray();
                assert(furnishings.length).equals(2);
            });
        });

        describe('given duplicate furnishing objects', () => {
            const furnishings = getFurnishingObjects([ table, table ]);

            it('returns an array with the furnishings consolidated', () => {
                assert(furnishings).isArray();
                assert(furnishings.length).equals(1);
            });

            it('returns the furnishing with a count of duplicates', () => {
                assert(furnishings[0].count).equals(2);
            });
        });
    });

    describe('getItemCount()', () => {
        describe('given an invalid quantity', () => {
            it('throws', () => {
                // @ts-expect-error
                assert(() => getItemCount('billion'))
                    .throws('Invalid quantity "${itemQuantity}" in getItemCount()');
            });
        });

        describe('given a quantity of "zero"', () => {
            it('returns 0', () => {
                assert(getItemCount('zero')).equals(0);
            });
        });

        describe('given a quantity of "one"', () => {
            it('returns 1', () => {
                assert(getItemCount('one')).equals(1);
            });
        });

        describe('given a quantity of "few"', () => {
            it('returns a value in the range of "few"', () => {
                const count        = getItemCount('few');
                const { min, max } = quantityRanges.few;
                const isInRange    = count >= min && count <= max;

                assert(isInRange).isTrue();
            });
        });

        describe('given a quantity of "numerous"', () => {
            it('returns a value in the range of "numerous"', () => {
                const count        = getItemCount('numerous');
                const { min, max } = quantityRanges.numerous;
                const isInRange    = count >= min && count <= max;

                assert(isInRange).isTrue();
            });
        });
    });

    // -- Public Functions -----------------------------------------------------

    describe('generateItems()', () => {
        /** @type {ItemConfig} */
        const config = {
            itemCondition: 'average',
            itemQuantity : 'one',
            itemRarity   : 'average',
            itemType     : 'clothing',
        };

        it('should return a object', () => {
            const results = generateItems(config);

            assert(results).isObject();
            assert(results.items).isArray();
            assert(results.containers).isArray();
        });

        describe('required configs', () => {
            [
                'itemCondition',
                'itemQuantity',
                'itemRarity',
                'itemType',
            ].forEach((requiredConfig) => {
                describe(`given no \`${requiredConfig}\``, () => {
                    const incompleteConfig = { ...config };
                    delete incompleteConfig[requiredConfig];

                    it('should throw', () => {
                        assert(() => generateItems(incompleteConfig))
                            .throws(`${requiredConfig} is required in generateItems()`);
                    });
                });
            });
        });

        describe('given a `roomType` and no `roomCondition`', () => {
            it('should throw', () => {
                assert(() => generateItems({
                    ...config,
                    roomType: 'room',
                })).throws('roomCondition is required for room items in generateItems()');
            });
        });

        describe('given a random `itemQuantity`', () => {
            it('should return an randomized item quantity', () => {
                const results = generateItems({ ...config, itemQuantity: 'random' });
                assert(results).isObject();
            });
        });

        describe('given an `itemQuantity` of zero', () => {
            describe('when there is no room', () => {
                it('returns empty results', () => {
                    const results = generateItems({ ...config, itemQuantity: 'zero' });

                    assert(results.containers.length).equals(0);
                    assert(results.conditionUniformity).isUndefined();
                    assert(results.rarityUniformity).isUndefined();
                    assert(results.items.length).equals(0);
                });
            });

            describe('when there is a room', () => {
                it('returns empty results', () => {
                    const results = generateItems({
                        ...config,
                        itemQuantity : 'zero',
                        roomType     : 'room',
                        roomCondition: 'average',
                    });

                    assert(results.containers.length).equals(0);
                    assert(results.conditionUniformity).isUndefined();
                    assert(results.rarityUniformity).isUndefined();
                    assert(results.items.length).equals(0);
                });
            });
        });

        describe('given a specific `itemQuantity`', () => {

        });
        // TODO incomplete test coverage
    });
};
