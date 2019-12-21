
import { title } from '../ui/title';

import quantity, { getRange } from '../attributes/quantity';

import { roll } from '../utility/roll';

import { getItem } from '../item';

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

    let list = [...Array(count)].map((_, i) => getItem().name).join(', ');

    return title(`Items (${count})`) + `<p>${list}</p>`;
};
