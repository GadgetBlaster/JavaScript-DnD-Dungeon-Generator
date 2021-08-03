// @ts-check

import rarity from '../../attributes/rarity.js';
import size from '../../attributes/size.js';
import type from '../type.js';

let { large } = size;
let { abundant, common, uncommon } = rarity;

const defaults = {
    rarity: uncommon,
    type  : type.survival,
};

const config = [
    { name: 'Bedroll', rarity: common },
    { name: 'Blanket', rarity: common },
    { name: 'Climber’s kit' },
    { name: 'Crampons' },
    { name: 'Firewood', rarity: abundant },
    { name: 'Fishhook' },
    { name: 'Fishing net, large', size: large },
    { name: 'Fishing net', variants: [ 'small', 'medium' ] },
    { name: 'Fishing tackle' },
    { name: 'Flint and steel' },
    { name: 'Hunting trap' },
    { name: 'Piton' },
    { name: 'Signal whistle' },
    { name: 'Tent', variants: [ 'one-person', 'two-person', 'pavilion' ] },
    { name: 'Tinderbox' },
];

export default config.map((item) => ({ ...defaults, ...item }));
