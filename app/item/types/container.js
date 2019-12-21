
import rarity from '../../attributes/rarity';
import size from '../../attributes/size';
import type from '../type';

const {
    tiny,
    small,
    medium,
    large,
} = size;

const {
    abundant,
    common,
    uncommon,
    rare,
} = rarity;

/**
 * Number of small items that fit into a container
 * 
 * @type {Object.<Size, number>}
 */
const capacities = {
    [tiny]: 0.5,
    [small]: 1,
    [medium]: 10,
    [large]: 20,
};

const defaults = {
    rarity: common,
    size: small,
    type: type.container,
};

const config = [
    { name: 'Backpack', size: large },
    { name: 'Barrel, large', size: large },
    { name: 'Barrel, medium', size: medium },
    { name: 'Barrel, small' },
    { name: 'Basket' },
    { name: 'Bottle, glass', size: tiny },
    { name: 'Bucket' },
    { name: 'Case, crossbow bolt' },
    { name: 'Case, map or scroll' },
    { name: 'Chest, large', size: large },
    { name: 'Chest, medium', size: medium },
    { name: 'Chest, small' },
    { name: 'Component pouch', rarity: rare },
    { name: 'Flask' },
    { name: 'Jug' },
    { name: 'Pitcher' },
    { name: 'Pouch', size: tiny },
    { name: 'Quiver' },
    { name: 'Sack', size: small },
    { name: 'Tankard', size: tiny, rarity: abundant },
    { name: 'Vial', rarity: uncommon },
    { name: 'Waterskin' },
];

export default config.map((item) => ({
    ...defaults,
    ...item,
    capacity: capacities[item.size] || capacities[defaults.size],
}));
