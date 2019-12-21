
import { getItem } from '../item';
import { list } from '../ui/list';
import { random } from '../utility/random';
import { roll } from '../utility/roll';
import { title } from '../ui/title';
import quantity, { getRange } from '../attributes/quantity';

const getItemCount = (itemQuantity) => {
    let { min, max } = getRange(itemQuantity);

    return roll(min, max);
};

export const getItemList = (config) => {
    let {
        itemCondition,
        itemQuantity,
    } = config;

    if (itemQuantity === quantity.zero) {
        return;
    }

    let count = getItemCount(itemQuantity);

    let counts = [ ...Array(count) ].reduce((obj) => {
        let item  = getItem();
        obj[item] = (obj[item] + 1) || 1;
        return obj;
    }, {});

    let items = Object.keys(counts).map((item) => {
        let count = counts[item];
        return count === 1 ? item : `[${count}x] ${item}`;
    });

    let content = [
        title(`Items (${count})`),
    ];

    if (itemQuantity !== quantity.one && itemCondition !== random) {
        content.push(`<p>All items in the room are in ${itemCondition} condition.</p>`)
    }

    content.push(list(items, { columns: 4 }));

    return content.join('');
};
