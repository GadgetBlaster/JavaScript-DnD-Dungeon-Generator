
import {
    _private,
    generateItems,
} from '../generate.js';

import { knobs } from '../../knobs.js';
import { random } from '../../utility/random.js';
import condition from '../../attributes/condition.js';
import itemType from '../type.js';
import quantity, { quantityMinimum, quantityMaximum } from '../../attributes/quantity.js';
import rarity from '../../attributes/rarity.js';
import roomTypes from '../../rooms/type.js';
import {
    anyRoomFurniture,
    furnishingByRoomType,
    furnishingQuantityRanges,
    furnitureQuantity,
    requiredRoomFurniture,
} from '../types/furnishing.js';

const {
    generateFurnishings,
    generateItemObjects,
    getFurnishingObjects,
    getItemCount,
} = _private;

/**
 * @param {import('../../unit/state.js').Utility}
 */
export default ({ assert, describe, it }) => {

    // -- Private Functions ----------------------------------------------------

    describe('generateFurnishings()', () => {
        it('should return an array', () => {
            let furniture = generateFurnishings(roomTypes.room, furnitureQuantity.minimum);
            assert(furniture).isArray();
        });

        describe('given `furnitureQuantity.none`', () => {
            it('should return an empty array', () => {
                let furniture = generateFurnishings(roomTypes.smithy, furnitureQuantity.none);
                assert(furniture).isArray();
                assert(furniture.length).equals(0);
            });
        });

        describe('given a `furnitureQuantity`', () => {
            it('should generate a number of furniture items within the furniture quantity range', () => {
                // Make sure `roomTypes.room` is not included in
                // `requiredRoomFurniture`.
                assert(requiredRoomFurniture[roomTypes.room]).isUndefined();

                let furniture = generateFurnishings(roomTypes.room, furnitureQuantity.furnished);
                let count = furniture.length;
                let max = furnishingQuantityRanges[furnitureQuantity.furnished];

                assert(count >= 1 && count <= max).isTrue();
            });
        });

        describe('given a `roomType` that requires furniture', () => {
            let furniture = generateFurnishings(roomTypes.smithy, furnitureQuantity.minimum)
                .map(({ name }) => name);

            it('should return an array including all required room type furniture', () => {
                // Make sure `roomTypes.smithy` is still included in
                // `requiredRoomFurniture`.
                assert(requiredRoomFurniture[roomTypes.smithy]).isArray();

                requiredRoomFurniture[roomTypes.smithy].forEach(({ name }) => {
                    assert(furniture.includes(name)).isTrue();
                });
            });
        });

        describe('given a room type included in `furnishingByRoomType`', () => {
            it('should include only furniture appropriate to the room type', () => {
                let validFurniture = furnishingByRoomType[roomTypes.room].concat(anyRoomFurniture)
                    .map(({ name }) => name);

                generateFurnishings(roomTypes.room, furnitureQuantity.furnished)
                    .forEach(({ name }) => {
                        assert(validFurniture.includes(name)).isTrue();
                    });
            });
        });

        describe('given a room type not included in `furnishingByRoomType`', () => {
            it('should include any furnishing', () => {
                // Make sure 'newRoomType' is not included in
                // `furnishingByRoomType`.
                assert(furnishingByRoomType.newRoomType).isUndefined();

                let furniture = generateFurnishings('newRoomType', furnitureQuantity.minimum).pop();
                assert(furniture).isObject();
                assert(furniture.name).isString();
            });
        });
    });

    describe('generateItemObjects()', () => {
        describe('given a count of 1', () => {
            let items = generateItemObjects(1, {
                [knobs.itemCondition]: random,
                [knobs.itemQuantity] : quantity.one,
                [knobs.itemRarity]   : random,
                [knobs.itemType]     : random,
            });

            let entries = Object.entries(items);
            let [ key, item ] = [ ...entries ].pop();

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
            let items = generateItemObjects(3, {
                [knobs.itemCondition]: random,
                [knobs.itemQuantity] : quantity.one,
                [knobs.itemRarity]   : random,
                [knobs.itemType]     : random,
            });

            let entries = Object.entries(items);

            it('should return an object keyed by the item\'s labels', () => {
                let invalidKeys = entries.find(([ key, item ]) => key !== item.label);
                assert(invalidKeys).isUndefined();
            });
        });

        describe('when duplicates of the same item are generated', () => {
            let items = generateItemObjects(3, {
                [knobs.itemCondition]: condition.average,
                [knobs.itemQuantity] : quantity.one,
                [knobs.itemRarity]   : rarity.common,
                [knobs.itemType]     : itemType.mysterious,
            });

            let entries = Object.entries(items);
            let [ key, item ] = [ ...entries ].pop();

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
        describe('given a single furnishing object', () => {
            let furnishings = getFurnishingObjects(
                [ { name: 'Table', label: 'Table' } ],
                condition.average
            );

            let entries = Object.entries(furnishings);
            let [ key, furnishing ] = [ ...entries ].pop();

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
            let furnishings = getFurnishingObjects(
                [ { name: 'Table', label: 'Table' }, { name: 'Chair', label: 'Chair' } ],
                condition.average
            );

            let entries = Object.entries(furnishings);

            it('should return an object keyed by the item\'s labels', () => {
                let invalidKeys = entries.find(([ key, item ]) => key !== item.label);
                assert(invalidKeys).isUndefined();
            });
        });

        describe('given duplicate furnishing objects', () => {
            let furnishings = getFurnishingObjects(
                [ { name: 'Table', label: 'Table' }, { name: 'Table', label: 'Table' } ],
                condition.average
            );

            let entries = Object.entries(furnishings);
            let [ key, item ] = [ ...entries ].pop();

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
            let furnishings = getFurnishingObjects(
                [ { name: 'Table', label: 'Table' } ],
                condition.average
            );

            let entries = Object.values(furnishings);
            let furnishing = [ ...entries ].pop();

            it('should not include the room condition in the furnishing\'s label', () => {
                assert(furnishing.label).stringExcludes(condition.average);
            });
        });

        describe('given a room condition other than average', () => {
            let furnishings = getFurnishingObjects(
                [ { name: 'Table', label: 'Table' } ],
                condition.decaying
            );

            let entries = Object.values(furnishings);
            let furnishing = [ ...entries ].pop();

            it('should include the room condition in the furnishing\'s label', () => {
                assert(furnishing.label).stringIncludes(condition.decaying);
            });
        });
    });

    describe('getItemCount()', () => {
        describe('given a quantity of `quantity.zero`', () => {
            it('should return 0', () => {
                assert(getItemCount(quantity.zero)).equals(0);
            });
        });

        describe('given a quantity of `quantity.one`', () => {
            it('should return 1', () => {
                assert(getItemCount(quantity.one)).equals(1);
            });
        });

        describe('given a quantity of `quantity.few`', () => {
            it('should return a value between `quantityMinimum.numerous` and `quantityMinimum.some` ', () => {
                let count     = getItemCount(quantity.few);
                let isInRange = count >= quantityMinimum.few && count < quantityMinimum.some;

                assert(isInRange).isTrue();
            });
        });

        describe('given a quantity of `quantity.numerous`', () => {
            it('should return a value between `quantityMinimum.numerous` and `quantityMaximum` ', () => {
                let count     = getItemCount(quantity.numerous);
                let isInRange = count >= quantityMinimum.numerous && count < quantityMaximum;

                assert(isInRange).isTrue();
            });
        });
    });

    // -- Public Functions -----------------------------------------------------

    describe('generateItems()', () => {
        let settings = {
            [knobs.itemCondition] : condition.average,
            [knobs.itemQuantity]  : quantity.one,
            [knobs.itemRarity]    : rarity.average,
            [knobs.itemType]      : itemType.clothing,
        };

        it('should return an array of strings', () => {
            let results = generateItems(settings);
            assert(results).isArray();
            assert(results.find((item) => typeof item !== 'string')).isUndefined();
        });

        it('the first item should be a title containing the number of Items', () => {
            assert(generateItems(settings).shift()).stringIncludes('Items (1)');
        });

        describe('given no `itemQuantity`', () => {
            it('should throw', () => {
                let sansItemQuantity = { ...settings };
                delete sansItemQuantity[knobs.itemQuantity];
                assert(() => generateItems(sansItemQuantity)).throws('Item quantity is required in generateItems()');
            });
        });

        describe('given no `itemRarity`', () => {
            it('should throw', () => {
                let sansItemRarity = { ...settings };
                delete sansItemRarity[knobs.itemRarity];
                assert(() => generateItems(sansItemRarity)).throws('Item rarity is required in generateItems()');
            });
        });

        describe('given no `itemRarity`', () => {
            it('should throw', () => {
                let sansItemRarity = { ...settings };
                delete sansItemRarity[knobs.itemRarity];
                assert(() => generateItems(sansItemRarity)).throws('Item rarity is required in generateItems()');
            });
        });

        describe('given no `itemType`', () => {
            it('should throw', () => {
                let sansItemType = { ...settings };
                delete sansItemType[knobs.itemType];
                assert(() => generateItems(sansItemType)).throws('Item type is required in generateItems()');
            });
        });

        describe('given no `itemCondition`', () => {
            it('should throw', () => {
                let sansItemCondition = { ...settings };
                delete sansItemCondition[knobs.itemCondition];
                assert(() => generateItems(sansItemCondition)).throws('Item condition is required in generateItems()');
            });
        });

        describe('given a `roomType` and no `roomCondition`', () => {
            it('should throw', () => {
                assert(() => generateItems({ ...settings, [knobs.roomType]: roomTypes.room }))
                    .throws('Room condition is required for room in generateItems()');
            });
        });

        describe('given a random `itemQuantity`', () => {
            it('should return an array of strings', () => {
                let results = generateItems({ ...settings, [knobs.itemQuantity]: random });
                assert(results).isArray();
                assert(results.find((item) => typeof item !== 'string')).isUndefined();
            });
        });

        describe('given an `itemQuantity` of zero', () => {
            describe('when there is no room', () => {
                it('should return an array with only a title', () => {
                    let results = generateItems({ ...settings, [knobs.itemQuantity]: quantity.zero });
                    assert(results).isArray();
                    assert(results.pop()).stringIncludes('Items (0)');
                });
            });

            describe('when there is a room', () => {
                it('should return an empty array', () => {
                    let results = generateItems({
                        ...settings,
                        [knobs.itemQuantity]: quantity.zero,
                        [knobs.roomType]: roomTypes.room,
                        [knobs.roomCondition]: condition.average,
                    });
                    assert(results).isArray();
                    assert(results.length).equals(0);
                });
            });
        });

        // TODO incomplete test coverage
    });
};