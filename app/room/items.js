
import { getRandomInt, getRandomArrayItem } from '/app/utility/random';
import items from '/app/item/item';
import quantity, { getRange } from '../attributes/quantity';
import { title } from '/app/ui/title';

const getItemCount = (itemQuantity) => {
    let { min, max } = getRange(itemQuantity);

    return getRandomInt(min, max);
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

    let list = [...Array(count)].map((_, i) => {
        return getRandomArrayItem(items).name;
    }).join(', ');

    return title(`Items (${count})`) + `${list}`;
};
