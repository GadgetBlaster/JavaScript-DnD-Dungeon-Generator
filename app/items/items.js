
import { generateItem } from '../item';
import { knobs } from '../knobs';
import { list } from '../ui/list';
import { random } from '../utility/random';
import { roll } from '../utility/roll';
import { title, paragraph } from '../ui/typography';
import quantity, { getRange } from '../attributes/quantity';

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

const getItemDescription = (item, count) => {
    return count === 1 ? item : `[${count}x] ${item}`;
};

const getConditionDescription = (itemCondition) => {
    return `Item Condition: ${itemCondition}`;
};

const getRarityDescription = (itemRarity) => {
    return `Item Rarity: ${itemRarity}`;
};

export const generateItems = (settings) => {
    let {
        [knobs.roomType]: roomType,
        [knobs.itemCondition]: itemCondition,
        [knobs.itemQuantity]: itemQuantity,
        [knobs.itemRarity]: itemRarity,
    } = settings;

    let inRoom = Boolean(roomType);

    if (itemQuantity === quantity.zero) {
        return inRoom ? [] : [ title('Items (0)') ];
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
        title(`Items (${count})`),
        description,
        list(itemList, { columns }),
    ].filter(Boolean);
};
