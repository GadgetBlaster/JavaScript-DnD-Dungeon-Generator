
import rarity from '../../attributes/rarity';
import type from '../type';

let { common, uncommon } = rarity;

const defaults = { 
    rarity: uncommon,
    type: type.survival,
};

const config = [
    { name: 'Bedroll', rarity: common },
    { name: 'Blanket', rarity: common },
    { name: 'Climber’s kit' },
    { name: 'Fishing tackle' },
    { name: 'Hunting trap' },
    { name: 'Piton' },
    { name: 'Signal whistle' },
    { name: 'Tent', variants: [ 'One-person', 'Two-person', 'TODO' ] },
    { name: 'Tinderbox' },
];

export default config.map((item) => ({ ...defaults, ...item }));
