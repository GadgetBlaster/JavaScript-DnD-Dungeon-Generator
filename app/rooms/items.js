
import { generateItem } from '../item';
import { knobs } from './knobs';
import { list } from '../ui/list';
import { random } from '../utility/random';
import { roll } from '../utility/roll';
import { title, paragraph } from '../ui/type';
import condition from '../attributes/condition';
import rarity from '../attributes/rarity';
import quantity, { getRange } from '../attributes/quantity';

const maxColumns = 4;

const getItemCount = (itemQuantity) => {
    let { min, max } = getRange(itemQuantity);

    return roll(min, max);
};

const generateItems = (count, settings) => [ ...Array(count) ].reduce((obj) => {
    let item  = generateItem(settings);
    obj[item] = (obj[item] + 1) || 1;
    return obj;
}, {});

const getItemDescription = (item, count) => {
    return count === 1 ? item : `[${count}x] ${item}`;
};

const getConditionDescription = (itemCondition) => {
    switch (itemCondition) {
        case condition.busted:
        case condition.decaying:
            return `Everything in the room is ${itemCondition}`;

        case condition.good:
        case condition.poor:
            return `All of the items in the room are in ${itemCondition} condition`;

        case condition.exquisite:
            return `The room’s contents are exquisite`;

        case condition.average:
        default:
            return;
    }
};

const getRarityDescription = (itemRarity) => {
    switch (itemRarity) {
        case rarity.exotic:
        case rarity.legendary:
        case rarity.rare:
            return `All the items in the room are ${itemRarity}`;

        case rarity.uncommon:
            return `The room’s items are uncommon`;

        case rarity.abundant:
        case rarity.average:
        case rarity.common:
        default:
            return;
    }
};

export const getItemList = (settings) => {
    let {
        [knobs.itemCondition]: itemCondition,
        [knobs.itemQuantity]: itemQuantity,
        [knobs.itemRarity]: itemRarity,
    } = settings;

    if (itemQuantity === quantity.zero) {
        return;
    }

    let count = getItemCount(itemQuantity);
    let items = generateItems(count, settings);

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
    let description = descriptions.length && paragraph(descriptions.join('. ')+'.');

    return [
        title(`Items (${count})`),
        description,
        list(itemList, { columns }),
    ].filter(Boolean).join('');
};
