
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
    { name: 'Electrum piece' },
    { name: 'Gold piece' },
    { name: 'Platinum piece' },
];

export default config.map((item) => ({ ...defaults, ...item }));
