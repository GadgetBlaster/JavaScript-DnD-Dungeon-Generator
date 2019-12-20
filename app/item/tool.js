
import rarity from '../attribute/rarity';

let { uncommon } = rarity;

const defaults = {};

const config = [
    { name: 'Ball bearings', quantity: [ 1, 1000 ], },
    { name: 'Block and tackle' },
    { name: 'Chain' },
    { name: 'Crowbar' },
    { name: 'Grappling hook', rarity: uncommon },
    { name: 'Hammer, sledge' },
    { name: 'Hammer' },
    { name: 'Wooden staff' },
];

export default config.map((item) => ({ ...defaults, ...item }));
