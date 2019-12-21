
import rarity from '../../attributes/rarity';

let { abundant, common } = rarity;

const defaults = { 
    rarity: common,
};

const config = [
    { name: 'Bell' },
    { name: 'Candle', rarity: abundant, quantity: 5 },
    { name: 'Totem' },
    { name: 'Manacles' },
    { name: 'Perfume', variants: [ 'Vial', 'Bottle' ] },
    { name: 'Torch' },
];

export default config.map((item) => ({ ...defaults, ...item }));
