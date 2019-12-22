
import { generateItem } from '../item';
import { knobs } from './knobs';
import { list } from '../ui/list';
import { random } from '../utility/random';
import { roll } from '../utility/roll';
import { title, paragraph } from '../ui/type';
import quantity, { getRange } from '../attributes/quantity';
import condition from '../attributes/condition';

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

    let content = [];

    if (itemQuantity !== quantity.one && itemCondition !== random) {
        content.push(getConditionDescription(itemCondition));
    }

    if (itemQuantity !== quantity.one && itemRarity !== random) {
        content.push(`The room is filled with ${itemRarity} items`)
    }

    let columns = Math.min(maxColumns, Math.max(1, Math.ceil(itemList.length / maxColumns)));
    let description = content.length && paragraph(content.join('. ')+'.');

    return [
        title(`Items (${count})`),
        description,
        list(itemList, { columns }),
    ].filter(Boolean).join('');
};
