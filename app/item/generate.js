// @ts-check

import { capacity, itemSizeSpace, maxItemQuantitySmall } from './types/container.js';
import {
    hideItemSetCondition,
    hideItemDetails,
    indicateItemSetRarity,
    itemsByRarity,
    itemsByType,
    mysteriousObject,
} from './item.js';
import {
    anyRoomFurniture,
    furnishing,
    furnishingByRoomType,
    furnishingQuantityRanges,
    probability as roomFurnishingProbability,
    requiredRoomFurniture,
} from './furnishing.js';
import { probability as conditionProbability } from '../attribute/condition.js';
import { probability as rarityProbability } from '../attribute/rarity.js';
import { isRequired, toss } from '../utility/tools.js';
import { roll, rollArrayItem } from '../utility/roll.js';
import { quantityRanges, probability as quantityProbability } from '../attribute/quantity.js';

// -- Type Imports -------------------------------------------------------------

/** @typedef {import('../attribute/condition.js').Condition} Condition */
/** @typedef {import('../attribute/quantity.js').Quantity} Quantity */
/** @typedef {import('../attribute/rarity.js').Rarity} Rarity */
/** @typedef {import('../attribute/size.js').Size} Size */
/** @typedef {import('../controller/knobs.js').Config} Config */
/** @typedef {import('../controller/knobs.js').ItemConfig} ItemConfig */
/** @typedef {import('../room/generate.js').RandomizedRoomConfig} RandomizedRoomConfig */
/** @typedef {import('../room/room.js').RoomType} RoomType */
/** @typedef {import('./furnishing.js').FurnitureQuantity} FurnitureQuantity */
/** @typedef {import('./item.js').ItemBase} ItemBase */
/** @typedef {import('./item.js').ItemType} ItemType */

// -- Types --------------------------------------------------------------------

/**
 * @typedef {object} Item
 *
 * @prop {string} name
 * @prop {Condition} condition
 * @prop {Rarity} rarity
 * @prop {Size} size
 * @prop {ItemType} type
 * @prop {number} count
 * @prop {number} setCount
 * @prop {number} [capacity] - Max number of small or tiny items which fit.
 * @prop {string} [variant]
 */

/**
 * @typedef {Item & { contents?: Item[] }} Container
 */

/**
 * @typedef {object} ItemSet
 *
 * @prop {Item[]} items
 * @prop {Container[]} containers
 * @prop {Condition} [conditionUniformity]
 * @prop {Rarity} [rarityUniformity]
 */

// -- Private Functions --------------------------------------------------------

/**
 * Aggregate items grouped by name, variant, condition, and set count.
 *
 * @private
 *
 * @param {Item[]} items
 *
 * @returns {Item[]}
 */
const aggregateItems = (items) => Object.values(items.reduce((obj, item) => {
    let { condition, name, setCount, variant } = item;

    let key = `${name}${variant || ''}.${condition}.${setCount}`;

    if (!obj[key]) {
        obj[key] = {
            ...item,
            count: 1,
        };

        return obj;
    }

    obj[key].count++;

    return obj;
}, {}));

/**
 * Generates a list of furnishings for the given room type.
 *
 * @private
 *
 * @param {RoomType} roomType
 * @param {FurnitureQuantity} quantity
 * @param {Condition} [roomCondition] // TODO make required
 *
 * @returns {Item[]}
 */
function generateFurnishingList(roomType, quantity, roomCondition = 'average') {
    let furniture = [];

    if (quantity === 'none') {
        return furniture;
    }

    if (requiredRoomFurniture[roomType]) {
        requiredRoomFurniture[roomType].forEach((item) => {
            furniture.push({
                ...item,
                condition: roomCondition,
            });
        });
    }

    let extraItems = roll(1, furnishingQuantityRanges[quantity]);
    let itemSet    = furnishingByRoomType[roomType]
        ? anyRoomFurniture.concat(furnishingByRoomType[roomType])
        : Object.values(furnishing);

    for (let i = 0; i < extraItems; i++) {
        let item = rollArrayItem(itemSet);

        furniture.push({
            ...item,
            condition: roomCondition,
        });
    }

    return furniture;
}

/**
 * Generates an item config based on room settings.
 *
 * @param {ItemConfig} config
 *
 * @returns {Item}
 */
function generateItem(config) {
    let {
        itemCondition,
        itemQuantity,
        itemRarity,
        itemType,
    } = config;

    isRequired(itemCondition, 'Item condition is required in generateItem()');
    isRequired(itemType, 'Item type is required in generateItem()');
    isRequired(itemQuantity, 'Item quantity is required in generateItem()');
    isRequired(itemRarity, 'Item rarity is required in generateItem()');

    itemQuantity === 'zero' && toss('Item quantity cannot be zero');

    if (itemRarity === 'random') {
        itemRarity = rarityProbability.roll();
    }

    let item = getRandomItem(itemType, itemRarity);

    let {
        type,
        name,
        maxCount = 1,
    } = item;

    if (hideItemDetails.has(type)) {
        itemCondition = 'average';
        itemRarity    = 'average';
    }

    if (itemCondition === 'random') {
        itemCondition = conditionProbability.roll();
    }

    let setCount = 1;

    if (maxCount > 1) {
        setCount = roll(1, maxCount);
    }

    let variant;

    if (item.variants) {
        variant = rollArrayItem(item.variants);
    }

    return {
        condition: itemCondition,
        count: 1,
        name,
        rarity: itemRarity,
        setCount,
        size: item.size,
        type: item.type,
        variant,
    };
}

/**
 * Generates a list of items.
 *
 * @private
 *
 * @param {number} count
 * @param {ItemConfig} config
 *
 * @returns {Item[]}
 */
function generateItemList(count, config) {
    let items = [];

    for (let i = 0; i < count; i++) {
        items.push(generateItem(config));
    }

    return items;
}

/**
 * Returns a randomized item of the given type and rarity.
 *
 * @private
 *
 * @param {ItemType | "random"} itemType
 * @param {Rarity} itemRarity
 *
 * @returns {ItemBase}
 */
function getRandomItem(itemType, itemRarity) {
    if (itemType === 'random') {
        if (!itemsByRarity[itemRarity]) {
            return mysteriousObject;
        }

        return rollArrayItem(itemsByRarity[itemRarity]);
    }

    if (!itemsByType[itemType]
        || !itemsByType[itemType][itemRarity]
        || !itemsByType[itemType][itemRarity].length
    ) {
        return mysteriousObject;
    }

    return rollArrayItem(itemsByType[itemType][itemRarity]);
}

/**
 * Get item count based on quantity config.
 *
 * @private
 *
 * @param {Quantity} itemQuantity
 *
 * @returns {number}
 */
function rollItemCount(itemQuantity) {
    let range = quantityRanges[itemQuantity];

    if (!range) {
        toss(`Invalid quantity "${itemQuantity}" in rollItemCount()`);
    }

    let { min, max } = range;

    return roll(min, max);
}

export {
    aggregateItems         as testAggregateItems,
    generateFurnishingList as testGenerateFurnishingList,
    generateItem           as testGenerateItem,
    generateItemList       as testGenerateItemList,
    getRandomItem          as testGetRandomItem,
    rollItemCount          as testRollItemCount,
};

// -- Public Functions ---------------------------------------------------------

/**
 * Generate items
 *
 * @param {ItemConfig} itemConfig
 * @param {RandomizedRoomConfig} [roomConfig]
 *
 * @returns {ItemSet}
 */
export function generateItems(itemConfig, roomConfig) {
    if (!itemConfig) {
        toss('itemConfig is required in generateItems()');
    }

    let {
        itemCondition,
        itemQuantity,
        itemRarity,
        itemType,
    } = itemConfig;

    !itemCondition && toss('itemCondition is required in generateItems()');
    !itemQuantity  && toss('itemQuantity is required in generateItems()');
    !itemRarity    && toss('itemRarity is required in generateItems()');
    !itemType      && toss('itemType is required in generateItems()');

    let {
        roomCondition,
        roomFurnitureQuantity,
        roomType,
    } = roomConfig || {};

    if (itemQuantity === 'random') {
        itemQuantity = quantityProbability.roll();
    }

    if (itemQuantity === 'zero') {
        return {
            containers: [],
            items: [],
        };
    }

    let count = rollItemCount(itemQuantity);
    let items = aggregateItems(generateItemList(count, {
        itemCondition,
        itemQuantity,
        itemRarity,
        itemType,
    }));

    /** @type {Container[]} */
    let containers = [];

    /** @type {Item[]} */
    let smallItems = [];

    /** @type {Item[]} */
    let remaining  = [];

    // TODO break out into function
    if (roomType && roomFurnitureQuantity) {
        let furnishings = aggregateItems(generateFurnishingList(roomType, roomFurnitureQuantity, roomCondition));

        // TODO break out into function for testing
        // distributeItems() ?
        furnishings.forEach((furnishingItem) => {
            if (furnishingItem.capacity) {
                containers.push(furnishingItem);
                return;
            }

            remaining.push(furnishingItem);
        });
    }

    items.forEach((item) => {
        if (item.type === 'container') {
            containers.push(item);
            return;
        }

        if (item.size === 'tiny' || item.size === 'small') {
            smallItems.push(item);
            return;
        }

        remaining.push(item);
    });

    // TODO break out into function for testing
    containers.forEach((_, index, array) => {
        let container = array[index];

        if (!smallItems.length) {
            return;
        }

        /** @type {Item[]} */
        let contents = [];

        let remainingSpace = capacity[container.size] || 0;
        let itemCount      = smallItems.length;

        for (let i = 0; i < itemCount; i++) {
            if (remainingSpace <= 0) {
                continue;
            }

            let item = smallItems[0];

            if (!item || (item.size !== 'tiny' && item.size !== 'small')) {
                continue;
            }

            if (item.count > maxItemQuantitySmall) {
                continue;
            }

            let spaceRequired     = itemSizeSpace[item.size] || Infinity;
            let spaceAfterAdded   = remainingSpace - spaceRequired;

            if (spaceAfterAdded < 0) {
                continue;
            }

            remainingSpace = spaceAfterAdded;

            let itemToAdd = smallItems.shift();

            itemToAdd && contents.push(itemToAdd);
        }

        if (contents.length) {
            container.contents = contents;
        }
    });

    /** @type {Item[]} */
    let emptyContainers = [];

    /** @type {Container[]} */
    let containerList = [];

    containers.forEach((container) => {
        if (!container.contents) {
            emptyContainers.push(container);
            return;
        }

        containerList.push(container);
    });

    /** @type {Item[]} */
    let itemList = remaining.concat(smallItems, emptyContainers).map((item) => item);

    let conditionUniformity;
    let rarityUniformity;

    if (itemQuantity !== 'one' && itemCondition !== 'random' && !hideItemSetCondition.has(itemCondition)) {
        conditionUniformity = itemCondition;
    }

    if (itemQuantity !== 'one' && itemRarity !== 'random' && indicateItemSetRarity.has(itemRarity)) {
        rarityUniformity = itemRarity;
    }

    return {
        conditionUniformity,
        containers: containerList,
        items: itemList,
        rarityUniformity,
    };
}
