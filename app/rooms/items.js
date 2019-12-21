
import { conditions } from '../attribute';
import { generateItem } from '../item';
import { knobs } from './knobs';
import { list } from '../ui/list';
import { random } from '../utility/random';
import { roll, rollArrayItem } from '../utility/roll';
import { title } from '../ui/title';
import condition from '../attributes/condition';
import quantity, { getRange } from '../attributes/quantity';

const getItemCount = (itemQuantity) => {
    let { min, max } = getRange(itemQuantity);

    return roll(min, max);
};

const generateItems = (count) => [ ...Array(count) ].reduce((obj) => {
    let item  = generateItem();
    obj[item] = (obj[item] + 1) || 1;
    return obj;
}, {});

const getItemDescription = (item, count, itemCondition) => {
    let label = count === 1 ? item : `[${count}x] ${item}`;

    if (itemCondition === random) {
        let randomCondition = rollArrayItem(conditions);

        if (randomCondition !== condition.average) {
            label += ` in ${randomCondition} condition`;
        }
    }

    return label;
};

export const getItemList = (config) => {
    let {
        [knobs.itemCondition]: itemCondition,
        [knobs.itemQuantity]: itemQuantity,
    } = config;

    if (itemQuantity === quantity.zero) {
        return;
    }

    let count = getItemCount(itemQuantity);
    let items = generateItems(count);

    let itemList = Object.keys(items).map((item) => {
        return getItemDescription(item, items[item], itemCondition);
    });

    let content = [
        title(`Items (${count})`),
    ];

    if (itemQuantity !== quantity.one && itemCondition !== random) {
        content.push(`<p>All of the items in the room are in ${itemCondition} condition.</p>`)
    }

    content.push(list(itemList, { columns: 4 }));

    return content.join('');
};
