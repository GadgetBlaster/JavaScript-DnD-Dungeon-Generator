// @ts-check

import { article } from '../ui/block.js';
import { capacity, itemSizeSpace, maxItemQuantitySmall } from './types/container.js';
import {
    hideItemDetails,
    indicateItemRarity,
    itemsByRarity,
    itemsByType,
} from './item.js';
import {
    anyRoomFurniture,
    furnishing,
    furnishingByRoomType,
    furnishingQuantityRanges,
    requiredRoomFurniture,
} from './furnishing.js';
import { probability as conditionProbability } from '../attribute/condition.js';
import { probability as rarityProbability } from '../attribute/rarity.js';
import { em, paragraph, strong, subtitle } from '../ui/typography.js';
import { getRarityDescription, getConditionDescription, getItemDescription } from './description.js';
import { isRequired, toss } from '../utility/tools.js';
import { list } from '../ui/list.js';
import { roll, rollArrayItem } from '../utility/roll.js';
import { getRange, probability as quantityProbability } from '../attribute/quantity.js';

// -- Type Imports -------------------------------------------------------------

/** @typedef {import('../attribute/condition.js').Condition} Condition */
/** @typedef {import('../attribute/quantity.js').Quantity} Quantity */
/** @typedef {import('../attribute/rarity.js').Rarity} Rarity */
/** @typedef {import('../attribute/size.js').Size} Size */
/** @typedef {import('../controller/knobs.js').Config} Config */
/** @typedef {import('./furnishing.js').FurnitureQuantity} FurnitureQuantity */
/** @typedef {import('./item.js').ItemType} ItemType */

// -- Types --------------------------------------------------------------------

/**
 * @typedef {object} Item
 *
 * @prop {string} name
 * @prop {string} label
 * @prop {Condition} condition
 * @prop {Rarity} rarity
 * @prop {Size} size
 * @prop {ItemType} type
 * @prop {number} count
 * @prop {number} [capacity] - Max number of small items found inside
 * @prop {string[]} [variants] - Array of variations
*/

// -- Config -------------------------------------------------------------------

/**
 * Maximum number of columns for dungeon item lists.
 *
 * TODO rename.
 */
const maxColumnsItems = 4;

/**
 * Maximum number of columns for non-dungeon room item lists.
 */
const maxColumnsRoom = 2;

// -- Private Functions --------------------------------------------------------

/**
 * Generates furnishings by room type.
 *
 * @private
 *
 * @param {string} roomType
 * @param {FurnitureQuantity} quantity
 *
 * @returns {Item[]}
 */
function generateFurnishings(roomType, quantity) {
    let furniture = [];

    if (quantity === 'none') {
        return furniture;
    }

    if (requiredRoomFurniture[roomType]) {
        requiredRoomFurniture[roomType].forEach((item) => {
            furniture.push(item);
        });
    }

    let extraItems = roll(1, furnishingQuantityRanges[quantity]);
    let itemSet    = furnishingByRoomType[roomType]
        ? anyRoomFurniture.concat(furnishingByRoomType[roomType])
        : Object.values(furnishing);

    for (let i = 0; i < extraItems; i++) {
        furniture.push(rollArrayItem(itemSet));
    }

    return furniture;
}

/**
 * Generates an item config based on room settings.
 *
 * @TODO break out or inject randomization logic for testing.
 *
 * @param {Config} config
 *
 * @returns {Item}
 */
const generateItem = (config) => {
    let {
        itemCondition: conditionSetting,
        itemQuantity : quantitySetting,
        itemRarity   : raritySetting,
        itemType     : itemType,
    } = config;

    !conditionSetting && toss('Item condition is required in generateItem()');
    !itemType         && toss('Item type is required in generateItem()');
    !quantitySetting  && toss('Item quantity is required in generateItem()');
    !raritySetting    && toss('Item rarity is required in generateItem()');
    quantitySetting === 'zero' && toss('Item quantity cannot be zero');

    let itemRarity    = raritySetting;
    let itemCondition = conditionSetting;

    if (raritySetting === 'random') {
        itemRarity = rarityProbability.roll();
    }

    let randomItem;

    // TODO break out into function, add early returns for undefined groups.
    if (itemType === 'random') {
        randomItem = itemsByRarity[itemRarity] && rollArrayItem(itemsByRarity[itemRarity]);
    } else {
        let itemsByTypeAndRarity = itemsByType[itemType] && itemsByType[itemType][itemRarity];
        randomItem = itemsByTypeAndRarity && itemsByTypeAndRarity.length && rollArrayItem(itemsByTypeAndRarity);
    }

    // TODO add type
    let item = randomItem || {
        name: 'Mysterious object',
        type: 'mysterious',
    };

    if (hideItemDetails.has(item.type)) {
        itemCondition = 'average';
        itemRarity    = 'average';
    }

    if (itemCondition === 'random') {
        itemCondition = conditionProbability.roll();
    }

    let isSingle          = quantitySetting === 'one';
    let indicateRare      = (isSingle || raritySetting === 'random')    && indicateItemRarity.has(itemRarity);
    let indicateCondition = (isSingle || conditionSetting === 'random') && itemCondition !== 'average';

    let name = indicateRare ? strong(item.name) : item.name;

    let notes = [];

    if (indicateRare) {
        notes.push(itemRarity);
    }

    if (indicateCondition) {
        notes.push(itemCondition);
    }

    let noteText = notes.length ? ` (${em(notes.join(', '))})` : '';

    let maxCount = 1;

    if (item.quantity > 1) {
        maxCount = roll(1, item.quantity);

        // TODO breakout into function
        if (maxCount > 1) {
            if (item.type === 'coin') {
                // TODO pluralize()
                name = `${maxCount} ${name}${maxCount > 1 ? 's' : ''}`;
            } else {
                name += `, set of ${maxCount}`;
            }
        }
    }

    if (item.variants) {
        let variant = rollArrayItem(item.variants);
        name += `, ${variant}`;
    }

    return {
        label: name + noteText,
        name,
        quantity: maxCount, // TODO count?
        rarity: itemRarity,
        size: item.size,
        type: item.type,
    };
};

/**
 * Generate item objects
 *
 * @private
 *
 * @param {number} count
 * @param {Config} config
 *
 * @returns {{ [label: string]: Item }}
 */
const generateItemObjects = (count, config) => [ ...Array(count) ].reduce((obj) => {
    let item  = generateItem(config);
    let label = item.label;

    // TODO use an identifier instead of label?
    if (!obj[label]) {
        obj[label] = { ...item };
        obj[label].count = 1;

        return obj;
    }

    obj[label].count++;

    return obj; // TODO rename to `items`
}, {});

/**
 * Get furnishing objects
 *
 * TODO rename to `getFurnishing()`
 * TODO move to furnishing.js
 *
 * @private
 *
 * @param {Item[]} furnishings
 * @param {string} roomCondition
 *
 * @returns {{ [label: string]: Item }}
 */
const getFurnishingObjects = (furnishings, roomCondition) => furnishings.reduce((obj, item) => {
    let label = item.label;

    if (roomCondition !== 'average') {
        label += ` (${em(roomCondition)})`;
    }

    // TODO use an identifier instead of label?
    if (!obj[label]) {
        obj[label] = { ...item, label };
        obj[label].count = 1;

        return obj;
    }

    obj[label].count++;

    return obj;
}, {});

/**
 * Get item count based on quantity config.
 *
 * @private
 *
 * @param {Quantity} itemQuantity
 *
 * @returns {number}
 */
function getItemCount(itemQuantity) {
    let { min, max } = getRange(itemQuantity);

    return roll(min, max);
}

export {
    generateFurnishings  as testGenerateFurnishings,
    generateItem         as testGenerateItem,
    generateItemObjects  as testGenerateItemObjects,
    getFurnishingObjects as testGetFurnishingObjects,
    getItemCount         as testGetItemCount,
};

// -- Public Functions ---------------------------------------------------------

/**
 * Generate items
 *
 * TODO separate HTMl from generation logic
 * TODO rename to generateItemsDescription
 *
 * @param {Config} config
 *
 * @returns {string[]}
 */
export function generateItems(config) {
    let {
        roomType,
        itemCondition,
        itemQuantity,
        itemRarity,
        itemType,
        roomFurnitureQuantity,
        roomCondition,
    } = config;

    isRequired(itemCondition, 'itemCondition is required in generateItems()');
    isRequired(itemQuantity,  'itemQuantity is required in generateItems()');
    isRequired(itemRarity,    'itemRarity is required in generateItems()');
    isRequired(itemType,      'itemType is required in generateItems()');

    let inRoom = Boolean(roomType); // TODO Boolean cast necessary?

    if (inRoom && !roomCondition) {
        isRequired(roomCondition, 'roomCondition is required for room items in generateItems()');
    }

    if (itemQuantity === 'random') {
        itemQuantity = quantityProbability.roll();
    }

    if (itemQuantity === 'zero') {
        return inRoom ? [] : [ subtitle('Items (0)') ];
    }

    let count = getItemCount(itemQuantity);
    let items = generateItemObjects(count, config);

    let containers = [];
    let smallItems = [];
    let remaining  = [];

    let furnishings   = inRoom ? generateFurnishings(roomType, roomFurnitureQuantity) : [];
    let furnishingObj = getFurnishingObjects(furnishings, roomCondition);

    let total = count + furnishings.length;

    // TODO break out into function for testing
    Object.keys(furnishingObj).forEach((key) => {
        let item = furnishingObj[key];

        if (item.capacity) {
            containers.push(item);
            return;
        }

        remaining.push(item);
    });

    // TODO break out into function for testing
    Object.keys(items).forEach((key) => {
        let item = items[key];

        if (item.type === itemType.container) {
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

        let contents       = [];
        let remainingSpace = capacity[container.size]; // TODO can be undefined
        let itemCount      = smallItems.length;

        for (let i = 0; i < itemCount; i++) {
            if (remainingSpace <= 0) {
                continue;
            }

            let item = smallItems[0];

            if (!item) {
                continue;
            }

            if (item.quantity > maxItemQuantitySmall) {
                continue;
            }

            let spaceRequired     = itemSizeSpace[item.size];
            let spaceAfterAdded   = remainingSpace - spaceRequired;

            if (spaceAfterAdded < 0) {
                continue;
            }

            remainingSpace = spaceAfterAdded;

            contents.push(smallItems.shift());
        }

        if (contents.length) {
            container.contents = contents;
        }
    });

    let emptyContainers = [];

    let containerList = containers.map((container) => {
        let hasStuff = container.contents;

        if (!hasStuff) {
            emptyContainers.push(container);
            return;
        }

        let containerItems = container.contents.length && container.contents.map((item) => getItemDescription(item));
        let desc  = getItemDescription(container);

        return article(desc + (containerItems ? list(containerItems) : ''));
    }).filter(Boolean).join('');

    let notContained = remaining.concat(smallItems, emptyContainers).map((item) => getItemDescription(item));
    let maxColumns   = inRoom ? maxColumnsRoom : maxColumnsItems;
    let columns      = Math.min(maxColumns, Math.max(1, Math.floor(notContained.length / maxColumns)));

    let itemList = containerList;

    if (notContained.length) {
        itemList += list(notContained, { 'data-columns': columns });
    }

    let descriptions = [];

    if (itemQuantity !== 'one' && itemCondition !== 'random') {
        let conditionDescription = getConditionDescription(itemCondition);
        conditionDescription && descriptions.push(conditionDescription);
    }

    if (itemQuantity !== 'one' && itemRarity !== 'random') {
        let rarityDescription = getRarityDescription(itemRarity);
        rarityDescription && descriptions.push(rarityDescription);
    }

    let description = descriptions.length && paragraph(descriptions.map((desc) => desc).join(' | '));

    return [
        subtitle(`Items (${total})`),
        description,
        itemList,
    ].filter(Boolean);
}
