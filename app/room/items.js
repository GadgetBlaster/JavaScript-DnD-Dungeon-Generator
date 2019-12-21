
import { getItem } from '../item';
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

    let items = [ ...Array(count) ].reduce((obj) => {
        let item  = getItem();
        obj[item] = (obj[item] + 1) || 1;
        return obj;
    }, {});

    let list  = Object.keys(items).map((item) => {
        let count = items[item];
        return count === 1 ? item : `[${count}x] ${item}`;
    });

    return title(`Items (${count})`) + `<p>${list.join(', ')}</p>`;
};
