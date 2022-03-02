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

import { quantityMinimum, quantityMaximum } from '../../attribute/quantity.js';
import {
    anyRoomFurniture,
    furnishingByRoomType,
    furnishingQuantityRanges,
    requiredRoomFurniture,
} from '../furnishing.js';

/** @typedef {import('../generate.js').Item} Item */

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
                    assert(furniture.includes(name)).isTrue();
                });
            });
        });

        describe('given a room type included in `furnishingByRoomType`', () => {
            it('should include only furniture appropriate to the room type', () => {
                const validFurniture = furnishingByRoomType.room.concat(anyRoomFurniture)
                    .map(({ name }) => name);

                generateFurnishings('room', 'furnished')
                    .forEach(({ name }) => {
                        assert(validFurniture.includes(name)).isTrue();
                    });
            });
        });

        describe('given a room type not included in `furnishingByRoomType`', () => {
            it('should include any furnishing', () => {
                // Make sure 'newRoomType' is not included in
                // `furnishingByRoomType`.
                // @ts-expect-error
                assert(furnishingByRoomType.newRoomType).isUndefined();

                const furniture = generateFurnishings('newRoomType', 'minimum').pop();
                assert(furniture).isObject();
                assert(furniture.name).isString();
            });
        });
    });

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

    describe('generateItemObjects()', () => {
        describe('given a count of 1', () => {
            const items = generateItemObjects(1, {
                itemCondition: 'random',
                itemQuantity : 'one',
                itemRarity   : 'random',
                itemType     : 'random',
            });

            const entries = Object.entries(items);
            const [ key, item ] = [ ...entries ].pop();

            it('should return an object with a single item', () => {
                assert(items).isObject();
                assert(entries.length).equals(1);
                assert(item).isObject();
                assert(item.name).isString();
                assert(item.label).isString();
            });

            it('should return an object keyed by the item\'s label', () => {
                assert(key).equals(item.label);
            });
        });

        describe('given a count greater than 1', () => {
            const items = generateItemObjects(3, {
                itemCondition: 'random',
                itemQuantity : 'one',
                itemRarity   : 'random',
                itemType     : 'random',
            });

            const entries = Object.entries(items);

            it('should return an object keyed by the item\'s labels', () => {
                const invalidKeys = entries.find(([ key, item ]) => key !== item.label);
                assert(invalidKeys).isUndefined();
            });
        });

        describe('when duplicates of the same item are generated', () => {
            const items = generateItemObjects(3, {
                itemCondition: 'average',
                itemQuantity : 'one',
                itemRarity   : 'common',
                itemType     : 'mysterious',
            });

            const entries = Object.entries(items);
            const [ key, item ] = [ ...entries ].pop();

            it('should return an object with the items consolidated', () => {
                assert(entries.length).equals(1);
            });

            it('should return an object keyed by the item\'s label', () => {
                assert(key).equals(item.label);
            });

            it('should return an item object with a count of duplicates', () => {
                assert(item.count).equals(3);
            });
        });
    });

    describe('getFurnishingObjects()', () => {
        /** @type {Item} table */
        const table = {
            condition: 'average',
            count: 1,
            label: 'Table',
            name: 'Table',
            rarity: 'average',
            size: 'medium',
            type: 'furnishing',
        };

        describe('given a single furnishing object', () => {
            const furnishings = getFurnishingObjects(
                [ table ],
                'average'
            );

            const entries = Object.entries(furnishings);
            const [ key, furnishing ] = [ ...entries ].pop();

            it('should return an object with a single furnishing', () => {
                assert(furnishings).isObject();
                assert(entries.length).equals(1);
                assert(furnishing).isObject();
                assert(furnishing.label).equals('Table');
                assert(furnishing.name).equals('Table');
            });

            it('should return an object keyed by the item\'s label', () => {
                assert(key).equals(furnishing.label);
            });
        });

        describe('given multiple furnishing objects', () => {
            const chair = {
                ...table,
                name: 'Chair',
                label: 'Chair',
            };

            const furnishings = getFurnishingObjects(
                [ table, chair ],
                'average'
            );

            const entries = Object.entries(furnishings);

            it('should return an object keyed by the item\'s labels', () => {
                const invalidKeys = entries.find(([ key, item ]) => key !== item.label);
                assert(invalidKeys).isUndefined();
            });
        });

        describe('given duplicate furnishing objects', () => {
            const furnishings = getFurnishingObjects(
                [ table, table ],
                'average'
            );

            const entries = Object.entries(furnishings);
            const [ key, item ] = [ ...entries ].pop();

            it('should return an object with the furnishings consolidated', () => {
                assert(entries.length).equals(1);
            });

            it('should return an object keyed by the furnishing\'s label', () => {
                assert(key).equals(item.label);
            });

            it('should return a furnishing object with a count of duplicates', () => {
                assert(item.count).equals(2);
            });
        });

        describe('given a room condition of average', () => {
            const furnishings = getFurnishingObjects(
                [ table ],
                'average'
            );

            const entries = Object.values(furnishings);
            const furnishing = [ ...entries ].pop();

            it('should not include the room condition in the furnishing\'s label', () => {
                assert(furnishing.label).stringExcludes('average');
            });
        });

        describe('given a room condition other than average', () => {
            const furnishings = getFurnishingObjects(
                [ table ],
                'decaying'
            );

            const entries = Object.values(furnishings);
            const furnishing = [ ...entries ].pop();

            it('should include the room condition in the furnishing\'s label', () => {
                assert(furnishing.label).stringIncludes('decaying');
            });
        });
    });

    describe('getItemCount()', () => {
        describe('given a quantity of `quantity.zero`', () => {
            it('should return 0', () => {
                assert(getItemCount('zero')).equals(0);
            });
        });

        describe('given a quantity of `quantity.one`', () => {
            it('should return 1', () => {
                assert(getItemCount('one')).equals(1);
            });
        });

        describe('given a quantity of `quantity.few`', () => {
            it('should return a value between `quantityMinimum.numerous` and `quantityMinimum.some` ', () => {
                const count     = getItemCount('few');
                const isInRange = count >= quantityMinimum.few && count < quantityMinimum.some;

                assert(isInRange).isTrue();
            });
        });

        describe('given a quantity of `quantity.numerous`', () => {
            it('should return a value between `quantityMinimum.numerous` and `quantityMaximum` ', () => {
                const count     = getItemCount('numerous');
                const isInRange = count >= quantityMinimum.numerous && count < quantityMaximum;

                assert(isInRange).isTrue();
            });
        });
    });

    // -- Public Functions -----------------------------------------------------

    describe('generateItems()', () => {
        const settings = {
            itemCondition: 'average',
            itemQuantity : 'one',
            itemRarity   : 'average',
            itemType     : 'clothing',
        };

        it('should return an array of strings', () => {
            const results = generateItems(settings);
            assert(results).isArray();
            assert(results.find((item) => typeof item !== 'string')).isUndefined();
        });

        it('the first item should be a title containing the number of Items', () => {
            assert(generateItems(settings).shift()).stringIncludes('Items (1)');
        });

        describe('required configs', () => {
            [
                'itemCondition',
                'itemQuantity',
                'itemRarity',
                'itemType',
            ].forEach((requiredConfig) => {
                describe(`given no \`${requiredConfig}\``, () => {
                    const incompleteConfig = { ...settings };
                    delete incompleteConfig[requiredConfig];

                    it('should throw', () => {
                        // @ts-expect-error // TODO double check
                        assert(() => generateItems(incompleteConfig))
                            .throws(`${requiredConfig} is required in generateItems()`);
                    });
                });
            });
        });

        describe('given a `roomType` and no `roomCondition`', () => {
            it('should throw', () => {
                assert(() => generateItems({
                    ...settings,
                    roomType: 'room',
                })).throws('roomCondition is required for room items in generateItems()');
            });
        });

        describe('given a random `itemQuantity`', () => {
            it('should return an array of strings', () => {
                const results = generateItems({ ...settings, itemQuantity: 'random' });
                assert(results).isArray();
                assert(results.find((item) => typeof item !== 'string')).isUndefined();
            });
        });

        describe('given an `itemQuantity` of zero', () => {
            describe('when there is no room', () => {
                it('should return an array with only a title', () => {
                    const results = generateItems({ ...settings, itemQuantity: 'zero' });
                    assert(results).isArray();
                    assert(results.pop()).stringIncludes('Items (0)');
                });
            });

            describe('when there is a room', () => {
                it('should return an empty array', () => {
                    const results = generateItems({
                        ...settings,
                        itemQuantity : 'zero',
                        roomType     : 'room',
                        roomCondition: 'average',
                    });
                    assert(results).isArray();
                    assert(results.length).equals(0);
                });
            });
        });

        // TODO incomplete test coverage
    });
};
