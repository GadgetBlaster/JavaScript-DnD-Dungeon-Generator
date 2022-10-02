// @ts-check

import {
    // Private Functions
    testAggregateItems         as aggregateItems,
    testGenerateFurnishingList as generateFurnishingList,
    testGenerateItem           as generateItem,
    testGenerateItemList       as generateItemList,
    testGetRandomItem          as getRandomItem,
    testRollItemCount          as rollItemCount,

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

import { itemTypes, itemsByRarity, itemsByType, mysteriousObject } from '../item.js';
import { conditions } from '../../attribute/condition.js';
import { rarities } from '../../attribute/rarity.js';
import { sizes } from '../../attribute/size.js';

/** @typedef {import('../generate.js').Item} Item */
/** @typedef {import('../../room/generate').RandomizedRoomConfig} RandomizedRoomConfig */
/** @typedef {import('../../controller/knobs').ItemConfig} ItemConfig */

/**
 * @param {import('../../unit/state.js').Utility} utility
 */
export default ({ assert, describe, it }) => {

    // -- Private Functions ----------------------------------------------------

    describe('aggregateItems()', () => {
        /** @type {Item} table */
        const table = {
            condition: 'average',
            count: 1,
            name: 'Table',
            rarity: 'average',
            setCount: 1,
            size: 'medium',
            type: 'furnishing',
        };

        describe('given a single item', () => {
            const furnishings = aggregateItems([ table ]);

            it('returns an array with that item', () => {
                assert(furnishings).isArray();
                assert(furnishings.length).equals(1);

                const furnishing = furnishings[0];
                assert(furnishing).isObject();
                assert(furnishing.name).equals('Table');
            });
        });

        describe('given multiple, different items', () => {
            const chair = {
                ...table,
                name: 'Chair',
                label: 'Chair',
            };

            const furnishings = aggregateItems([ table, chair ]);

            it('return an array of furnishings for the given items', () => {
                assert(furnishings).isArray();
                assert(furnishings.length).equals(2);
            });
        });

        describe('given duplicate items', () => {
            const furnishings = aggregateItems([ table, table ]);

            it('returns an array with the furnishings consolidated', () => {
                assert(furnishings).isArray();
                assert(furnishings.length).equals(1);
            });

            it('returns the item with a count incremented', () => {
                assert(furnishings[0].count).equals(2);
            });
        });
    });

    describe('generateFurnishingList()', () => {
        it('should return an array', () => {
            const furniture = generateFurnishingList('room', 'minimum');
            assert(furniture).isArray();
        });

        describe('given `none`', () => {
            it('should return an empty array', () => {
                const furniture = generateFurnishingList('smithy', 'none');
                assert(furniture).isArray();
                assert(furniture.length).equals(0);
            });
        });

        describe('given a furniture quantity', () => {
            it('should generate a number of furniture items within the furniture quantity range', () => {
                // Make sure "room" is not included in
                // `requiredRoomFurniture`.
                assert(requiredRoomFurniture.room).isUndefined();

                const furniture = generateFurnishingList('room', 'furnished');
                const count     = furniture.length;
                const max       = furnishingQuantityRanges.furnished;

                assert(count >= 1 && count <= max).isTrue();
            });
        });

        describe('given a `roomType` that requires furniture', () => {
            const furniture = generateFurnishingList('smithy', 'minimum')
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

                generateFurnishingList('room', 'furnished')
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

                // @ts-expect-error
                const furniture = generateFurnishingList('newRoomType', 'minimum').pop();

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

            assert(item.condition).isInArray(conditions);
            assert(item.count).equals(1);
            assert(item.name).isString();
            assert(item.rarity).isInArray(rarities);
            assert(item.setCount).equals(1);
            assert(item.size).isInArray(sizes);
            assert(item.type).isInArray(itemTypes);
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

    describe('generateItemList()', () => {
        describe('given a count of 1', () => {
            const items = generateItemList(1, {
                itemCondition: 'random',
                itemQuantity : 'one',
                itemRarity   : 'random',
                itemType     : 'random',
            });

            it('returns a single item', () => {
                assert(items).isArray();
                assert(items.length).equals(1);

                const item = items[0];
                assert(item).isObject();
                assert(item.name).isString();
            });
        });

        describe('given a count greater than 1', () => {
            const items = generateItemList(3, {
                itemCondition: 'random',
                itemQuantity : 'one',
                itemRarity   : 'random',
                itemType     : 'random',
            });

            it('returns items for the given count', () => {
                assert(items).isArray();
                assert(items.length).equals(3);
            });
        });
    });

    describe('getRandomItem()', () => {
        describe('given an item type of "random"', () => {
            describe('given an item rarity which has no items', () => {
                it('returns a mysterious object', () => {
                    // @ts-expect-error
                    assert(getRandomItem('random', 'notARarity')).equalsObject(mysteriousObject);
                });
            });

            describe('given an item rarity which has items', () => {
                it('returns a random object of that rarity', () => {
                    // Assert there are items in the legendary rarity group.
                    assert(itemsByRarity.legendary).isArray();
                    assert(itemsByRarity.legendary.length === 0).isFalse();

                    assert(getRandomItem('random', 'legendary').rarity).equals('legendary');
                });
            });
        });

        describe('given an item type', () => {
            describe('given an item type which has no items', () => {
                it('returns a mysterious object', () => {
                    // @ts-expect-error
                    assert(getRandomItem('notAType', 'legendary')).equalsObject(mysteriousObject);
                });
            });

            describe('given an item rarity which has no items', () => {
                it('returns a mysterious object', () => {
                    // Assert there are rarity groups in the armor group.
                    assert(itemsByType.armor).isObject();

                    // @ts-expect-error
                    assert(getRandomItem('armor', 'notARarity')).equalsObject(mysteriousObject);
                });
            });

            describe('given an item type and rarity which has items', () => {
                it('returns a random object of that type and rarity', () => {
                    // Assert there are rare items in the armor group.
                    assert(itemsByType.armor).isObject();
                    assert(itemsByType.armor.rare).isArray();
                    assert(itemsByType.armor.rare.length === 0).isFalse();

                    let item = getRandomItem('armor', 'rare');

                    assert(item.type).equals('armor');
                    assert(item.rarity).equals('rare');
                });
            });
        });
    });

    describe('rollItemCount()', () => {
        describe('given an invalid quantity', () => {
            it('throws', () => {
                // @ts-expect-error
                assert(() => rollItemCount('billion'))
                    .throws('Invalid quantity "billion" in rollItemCount()');
            });
        });

        describe('given a quantity of "zero"', () => {
            it('returns 0', () => {
                assert(rollItemCount('zero')).equals(0);
            });
        });

        describe('given a quantity of "one"', () => {
            it('returns 1', () => {
                assert(rollItemCount('one')).equals(1);
            });
        });

        describe('given a quantity of "few"', () => {
            it('returns a value in the range of "few"', () => {
                const count        = rollItemCount('few');
                const { min, max } = quantityRanges.few;
                const isInRange    = count >= min && count <= max;

                assert(isInRange).isTrue();
            });
        });

        describe('given a quantity of "numerous"', () => {
            it('returns a value in the range of "numerous"', () => {
                const count        = rollItemCount('numerous');
                const { min, max } = quantityRanges.numerous;
                const isInRange    = count >= min && count <= max;

                assert(isInRange).isTrue();
            });
        });
    });

    // -- Public Functions -----------------------------------------------------

    describe('generateItems()', () => {
        /** @type {ItemConfig} */
        const itemConfig = {
            itemCondition: 'average',
            itemQuantity : 'one',
            itemRarity   : 'average',
            itemType     : 'clothing',
        };

        /** @type {RandomizedRoomConfig} */
        const randomizedRoomConfig = {
            itemQuantity         : 'one',
            roomCondition        : 'average',
            roomFurnitureQuantity: 'none',
            roomSize             : 'medium',
            roomType             : 'room',
        };

        it('should return a object', () => {
            const results = generateItems(itemConfig);

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
                    const incompleteConfig = { ...itemConfig };
                    delete incompleteConfig[requiredConfig];

                    it('should throw', () => {
                        assert(() => generateItems(incompleteConfig))
                            .throws(`${requiredConfig} is required in generateItems()`);
                    });
                });
            });
        });

        describe('given a random `itemQuantity`', () => {
            it('should return an randomized item quantity', () => {
                const results = generateItems({ ...itemConfig, itemQuantity: 'random' });
                assert(results).isObject();
            });
        });

        describe('given an `itemQuantity` of zero', () => {
            describe('when there is no room', () => {
                it('returns empty results', () => {
                    const results = generateItems({ ...itemConfig, itemQuantity: 'zero' });

                    assert(results.containers.length).equals(0);
                    assert(results.conditionUniformity).isUndefined();
                    assert(results.rarityUniformity).isUndefined();
                    assert(results.items.length).equals(0);
                });
            });

            describe('when there is a room', () => {
                it('returns empty results', () => {
                    const results = generateItems(
                        { ...itemConfig, itemQuantity: 'zero' },
                        randomizedRoomConfig
                    );

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
