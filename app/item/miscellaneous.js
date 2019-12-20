
import rarity from '../attribute/rarity';

let { abundant, common } = rarity;

const defaults = { 
    rarity: common,
};

const config = [
    { name: 'Bell' },
    { name: 'Candle', rarity: abundant, quantity: 5 },
    { name: 'Totem' },
];

export default config.map((item) => ({ ...defaults, ...item }));
