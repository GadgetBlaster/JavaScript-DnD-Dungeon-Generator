// @ts-check

import { article } from '../ui/block.js';
import { capacity, itemSizeSpace, maxItemQuantitySmall } from './types/container.js';
import furnishing, {
    anyRoomFurniture,
    furnishingByRoomType,
    furnishingQuantityRanges,
    furnitureQuantity, // TODO rename?
    requiredRoomFurniture,
} from './types/furnishing.js';
import { em, paragraph, subtitle } from '../ui/typography.js';
import { generateItem } from './item.js';
import { getRarityDescription, getConditionDescription, getItemDescription } from './description.js';
import { isRequired } from '../utility/tools.js';
import { knobs } from '../knobs.js';
import { list } from '../ui/list.js';
import { random } from '../utility/random.js';
import { roll, rollArrayItem } from '../utility/roll.js';
import condition from '../attributes/condition.js';
import quantity, { getRange, probability as quantityProbability } from '../attributes/quantity.js';
import size from '../attributes/size.js';

// -- Types --------------------------------------------------------------------

/** @typedef {import('../knobs.js').Config} Config */
/** @typedef {import('./item.js').Item} Item */

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
 * @param {string} quantity
 *
 * @returns {Item[]}
 */
function generateFurnishings(roomType, quantity) {
    let furniture = [];

    if (quantity === furnitureQuantity.none) {
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

    if (roomCondition !== condition.average) {
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
 * @param {string} itemQuantity
 *
 * @returns {number}
 */
function getItemCount(itemQuantity) {
    let { min, max } = getRange(itemQuantity);

    return roll(min, max);
}

export {
    generateFurnishings  as testGenerateFurnishings,
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
        // TODO
        [knobs.roomType]      : roomType,
        [knobs.itemCondition] : itemCondition,
        [knobs.itemQuantity]  : itemQuantity,
        [knobs.itemRarity]    : itemRarity,
        [knobs.itemType]      : itemType,
        [knobs.roomFurnishing]: furnitureQuantity,
        [knobs.roomCondition] : roomCondition,
    } = config;

    isRequired(itemCondition, 'itemCondition is required in generateItems()');
    isRequired(itemQuantity,  'itemQuantity is required in generateItems()');
    isRequired(itemRarity,    'itemRarity is required in generateItems()');
    isRequired(itemType,      'itemType is required in generateItems()');

    let inRoom = Boolean(roomType); // TODO Boolean cast necessary?

    if (inRoom && !roomCondition) {
        isRequired(roomCondition, 'roomCondition is required for room items in generateItems()');
    }

    if (itemQuantity === random) {
        itemQuantity = quantityProbability.roll();
    }

    if (itemQuantity === quantity.zero) {
        return inRoom ? [] : [ subtitle('Items (0)') ];
    }

    let count = getItemCount(itemQuantity);
    let items = generateItemObjects(count, config);

    let containers = [];
    let smallItems = [];
    let remaining  = [];

    let furnishings   = inRoom ? generateFurnishings(roomType, furnitureQuantity) : [];
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

        if (item.size === size.tiny || item.size === size.small) {
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
        let remainingSpace = capacity[container.size];
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
        };

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

        let items = container.contents.length && container.contents.map((item) => getItemDescription(item));
        let desc  = getItemDescription(container);

        return article(desc + (items ? list(items) : ''));
    }).filter(Boolean).join('');

    let notContained = remaining.concat(smallItems, emptyContainers).map((item) => getItemDescription(item));
    let maxColumns   = inRoom ? maxColumnsRoom : maxColumnsItems;
    let columns      = Math.min(maxColumns, Math.max(1, Math.floor(notContained.length / maxColumns)));

    let itemList = containerList;

    if (notContained.length) {
        itemList += list(notContained, { 'data-columns': columns });
    }

    let descriptions = [];

    if (itemQuantity !== quantity.one && itemCondition !== random) {
        let conditionDescription = getConditionDescription(itemCondition)
        conditionDescription && descriptions.push(conditionDescription);
    }

    if (itemQuantity !== quantity.one && itemRarity !== random) {
        let rarityDescription = getRarityDescription(itemRarity);
        rarityDescription && descriptions.push(rarityDescription)
    }

    let description = descriptions.length && paragraph(descriptions.map((desc) => desc).join(' | '));

    return [
        subtitle(`Items (${total})`),
        description,
        itemList,
    ].filter(Boolean);
}
