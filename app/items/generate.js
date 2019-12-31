
import { generateItem } from './item';
import { getRarityDescription, getConditionDescription, getItemDescription } from './description';
import { knobs } from '../knobs';
import { list } from '../ui/list';
import { random } from '../utility/random';
import { roll } from '../utility/roll';
import { subTitle, paragraph } from '../ui/typography';
import itemType from './type';
import quantity, { getRange, probability as quantityProbability } from '../attributes/quantity';
import size from '../attributes/size';

const maxColumns = 2;

const getItemCount = (itemQuantity) => {
    let { min, max } = getRange(itemQuantity);

    return roll(min, max);
};

const generateItemObjects = (count, settings) => [ ...Array(count) ].reduce((obj) => {
    let item  = generateItem(settings);
    let label = item.label;

    if (!obj[label]) {
        obj[label] = item;
        obj[label].count = 1;

        return obj;
    }

    obj[label].count++;

    return obj;
}, {});

export const generateItems = (settings) => {
    let {
        [knobs.roomType]     : roomType,
        [knobs.itemCondition]: itemCondition,
        [knobs.itemQuantity] : itemQuantity,
        [knobs.itemRarity]   : itemRarity,
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

    Object.keys(items).forEach((item) => {
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

    let itemList = Object.keys(items).map((key) => {
        return getItemDescription(items[key]);
    });

    let descriptions = [];

    if (itemQuantity !== quantity.one && itemCondition !== random) {
        let conditionDescription = getConditionDescription(itemCondition)
        conditionDescription && descriptions.push(conditionDescription);
    }

    if (itemQuantity !== quantity.one && itemRarity !== random) {
        let rarityDescription = getRarityDescription(itemRarity);
        rarityDescription && descriptions.push(rarityDescription)
    }

    let columns = Math.min(maxColumns, Math.max(1, Math.ceil(itemList.length / maxColumns)));
    let description = descriptions.length && paragraph(descriptions.map((desc) => desc).join(' | '));

    return [
        subTitle(`Items (${count})`),
        description,
        list(itemList, { 'data-columns': columns }),
    ].filter(Boolean);
};
