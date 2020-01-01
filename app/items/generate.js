
import { article } from '../ui/block';
import { capacity, itemSizeSpace, maxItemQuantitySmall } from './types/container';
import { generateFurnishings } from './types/furnishing';
import { generateItem } from './item';
import { getRarityDescription, getConditionDescription, getItemDescription } from './description';
import { knobs } from '../knobs';
import { list } from '../ui/list';
import { random } from '../utility/random';
import { roll } from '../utility/roll';
import { subTitle, paragraph, em } from '../ui/typography';
import condition from '../attributes/condition';
import itemType from './type';
import quantity, { getRange, probability as quantityProbability } from '../attributes/quantity';
import size from '../attributes/size';

const debugContainerFill = false;

const maxColumnsItems = 4;
const maxColumnsRoom  = 2;

const getItemCount = (itemQuantity) => {
    let { min, max } = getRange(itemQuantity);

    return roll(min, max);
};

const generateItemObjects = (count, settings) => [ ...Array(count) ].reduce((obj) => {
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

export const generateItems = (settings) => {
    let {
        [knobs.roomType]      : roomType,
        [knobs.itemCondition] : itemCondition,
        [knobs.itemQuantity]  : itemQuantity,
        [knobs.itemRarity]    : itemRarity,
        [knobs.roomFurnishing]: furnitureQuantity,
        [knobs.roomCondition] : roomCondition,
    } = settings;

    if (itemQuantity === random) {
        itemQuantity = quantityProbability.roll();
    }

    let inRoom = Boolean(roomType);

    if (itemQuantity === quantity.zero) {
        return inRoom ? [] : [ subTitle('Items (0)') ];
    }

    let count = getItemCount(itemQuantity);
    let items = generateItemObjects(count, settings);

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
                debugContainerFill && console.log(`${item.label} quantity of ${item.quantity} is too many for ${container.label}`);
                continue;
            }

            let spaceRequired     = itemSizeSpace[item.size];
            let spaceAfterAdded   = remainingSpace - spaceRequired;

            if (spaceAfterAdded < 0) {
                debugContainerFill && console.log(`${container.label} capacity of ${capacity[container.size]} is too small for ${item.label} of size ${spaceRequired}`);
                continue;
            }

            remainingSpace = spaceAfterAdded;

            debugContainerFill && console.log(`placed ${item.label} of size ${spaceRequired} into ${container.label} of size ${capacity[container.size]}, remaining space ${remainingSpace}`);

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
        subTitle(`Items (${total})`),
        description,
        itemList,
    ].filter(Boolean);
};
