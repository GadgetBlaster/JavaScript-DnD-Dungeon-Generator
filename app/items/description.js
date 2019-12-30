
import condition from '../attributes/condition';
import rarity from '../attributes/rarity';

const rarityIndicated = new Set([
    rarity.uncommon,
    rarity.rare,
    rarity.exotic,
    rarity.legendary,
]);

export const getItemDescription = (item, count) => {
    return count === 1 ? item : `[${count}x] ${item}`;
};

export const getConditionDescription = (itemCondition) => {
    let showCondition = itemCondition !== condition.average;
    return showCondition && `Item Condition: ${itemCondition}`;
};

export const getRarityDescription = (itemRarity) => {
    let showRarity = rarityIndicated.has(itemRarity);
    return showRarity && `Item Rarity: ${itemRarity}`;
};