
import rarity from '../../attributes/rarity';
import size from '../../attributes/size';

let { abundant, common } = rarity;
let { tiny, medium, large } = size;

const defaults = {
    rarity: common,
};

const config = [
    { name: 'Bell' },
    { name: 'Bone', variants: [ 'finger', 'foot', 'vertebrae' ], size: tiny, quantity: 10 },
    { name: 'Bone', variants: [ 'rib', 'pelvis', 'femur', 'leg', 'arm' ] },
    { name: 'Candle', rarity: abundant, quantity: 5 },
    { name: 'Manacles' },
    { name: 'Perfume', variants: [ 'vial', 'bottle' ] },
    { name: 'Rock', size: large },
    { name: 'Rock', size: medium },
    { name: 'Stone', size: tiny },
    { name: 'Skull' },
    { name: 'Torch' },
    { name: 'Totem' },
];

export default config.map((item) => ({ ...defaults, ...item }));
