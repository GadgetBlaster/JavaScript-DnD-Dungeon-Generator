
import rarity from '../../attributes/rarity';
import type from '../type';

let {
    common,
    uncommon,
    rare,
} = rarity;

const defaults = {
    quantity: 200,
    type: type.coin,
    rarity: uncommon,
};

const config = [
    { name: 'Copper piece', rarity: common },
    { name: 'Silver piece' },
    { name: 'Electrum piece', rarity: rare },
    { name: 'Gold piece' },
    { name: 'Platinum piece', rarity: rare },
];

export default config.map((item) => ({ ...defaults, ...item }));
