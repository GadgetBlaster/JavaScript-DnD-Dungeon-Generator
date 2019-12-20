
import rarity from '../attribute/rarity';

let { common, uncommon } = rarity;

const defaults = { 
    rarity: uncommon,
};

const config = [
    { name: 'Bedroll', rarity: common },
    { name: 'Blanket', rarity: common },
    { name: 'Climber’s kit' },
    { name: 'Fishing tackle' },
];

export default config.map((item) => ({ ...defaults, ...item }));
