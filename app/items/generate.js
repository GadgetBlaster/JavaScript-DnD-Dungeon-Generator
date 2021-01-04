
import { article } from '../ui/block.js';
import { capacity, itemSizeSpace, maxItemQuantitySmall } from './types/container.js';
import { generateFurnishings } from './types/furnishing.js';
import { generateItem } from './item.js';
import { getRarityDescription, getConditionDescription, getItemDescription } from './description.js';
import { knobs } from '../knobs.js';
import { list } from '../ui/list.js';
import { random } from '../utility/random.js';
import { roll } from '../utility/roll.js';
import { em, paragraph, subtitle,  } from '../ui/typography.js';
import condition from '../attributes/condition.js';
import quantity, { getRange, probability as quantityProbability } from '../attributes/quantity.js';
import size from '../attributes/size.js';

// -- Config -------------------------------------------------------------------

/**
 * Maximum number of columns for dungeon item lists.
 *
 * TODO rename.
 *
 * @type {number}
 */
const maxColumnsItems = 4;

/**
 * Maximum number of columns for non-dungeon room item lists.
 *
 * @type {number}
 */
const maxColumnsRoom = 2;

// -- Private Functions --------------------------------------------------------

/**
 * Get item count based on quantity config.
 *
 * @param {string} itemQuantity
 *
 * @returns {number}
 */
export const _getItemCount = (itemQuantity) => {
    let { min, max } = getRange(itemQuantity);

    return roll(min, max);
};

export const _generateItemObjects = (count, settings) => [ ...Array(count) ].reduce((obj) => {
    let item  = generateItem(settings);
    let label = item.label;

    if (!obj[label]) {
        obj[label] = { ...item };
        obj[label].count = 1;

        return obj;
    }

    obj[label].count++;

    return obj;
}, {});

const getFurnishingObjects = (furnishings, roomCondition) => furnishings.reduce((obj, item) => {
    let label = item.label;

    if (roomCondition !== condition.average) {
        label += ` (${em(roomCondition)})`;
    }

    if (!obj[label]) {
        obj[label] = { ...item, label };
        obj[label].count = 1;

        return obj;
    }

    obj[label].count++;

    return obj;
}, {});

// -- Public Functions ---------------------------------------------------------

export const generateItems = (settings) => {
    let {
        [knobs.roomType]      : roomType,
        [knobs.itemCondition] : itemCondition,
        [knobs.itemQuantity]  : itemQuantity,
        [knobs.itemRarity]    : itemRarity,
        [knobs.itemType]      : itemType,
        [knobs.roomFurnishing]: furnitureQuantity,
        [knobs.roomCondition] : roomCondition,
    } = settings;

    if (!itemQuantity) {
        throw new TypeError('Item quantity is required in generateItems()');
    }

    if (!itemRarity) {
        throw new TypeError('Item rarity is required in generateItems()');
    }

    if (!itemType) {
        throw new TypeError('Item type is required in generateItems()');
    }

    if (!itemCondition) {
        throw new TypeError('Item condition is required in generateItems()');
    }

    if (itemQuantity === random) {
        itemQuantity = quantityProbability.roll();
    }

    let inRoom = Boolean(roomType);

    if (itemQuantity === quantity.zero) {
        return inRoom ? [] : [ subtitle('Items (0)') ];
    }

    let count = _getItemCount(itemQuantity);
    let items = _generateItemObjects(count, settings);

    let containers = [];
    let smallItems = [];
    let remaining  = [];

    let furnishings   = inRoom ? generateFurnishings(roomType, furnitureQuantity) : [];
    let furnishingObj = getFurnishingObjects(furnishings, roomCondition);

    let total = count + furnishings.length;

    Object.keys(furnishingObj).forEach((key) => {
        let item = furnishingObj[key];

        if (item.capacity) {
            containers.push(item);
            return;
        }

        remaining.push(item);
    });

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
};
