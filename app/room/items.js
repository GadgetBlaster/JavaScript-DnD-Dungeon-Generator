
import { quantity, getRange } from '/app/attribute/quantity';
import { items } from '/app/item/item';
import { getRandomInt, getRandomArrayItem } from '/app/utility/random';

const getItemCount = (itemQuantity) => {
    let { min, max } = getRange(itemQuantity);

    return getRandomInt(min, max);
}

export const getItemList = (config) => {
    let {
        itemCondition,
        itemQuantity,
    } = config;

    if (itemQuantity === quantity.zero) {
        return 'Items: None';
    }

    let count = getItemCount(itemQuantity);

    let list = [...Array(count)].map((_, i) => {
        return getRandomArrayItem(items).name;
    }).join(', ');

    return `Items (${count}): ${list}`;
};
