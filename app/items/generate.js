
import { generateItem } from './item';
import { getRarityDescription, getConditionDescription, getItemDescription } from './description';
import { knobs } from '../knobs';
import { list } from '../ui/list';
import { random } from '../utility/random';
import { roll } from '../utility/roll';
import { subTitle, paragraph } from '../ui/typography';
import quantity, { getRange, probability as quantityProbability } from '../attributes/quantity';

const maxColumns = 3;

const getItemCount = (itemQuantity) => {
    let { min, max } = getRange(itemQuantity);

    return roll(min, max);
};

const generateItemObjects = (count, settings) => [ ...Array(count) ].reduce((obj) => {
    let item  = generateItem(settings);
    obj[item] = (obj[item] + 1) || 1;
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

    let itemList = Object.keys(items).map((item) => {
        return getItemDescription(item, items[item]);
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
