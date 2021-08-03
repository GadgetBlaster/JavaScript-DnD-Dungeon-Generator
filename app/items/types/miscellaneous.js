// @ts-check

import rarity from '../../attributes/rarity.js';
import size from '../../attributes/size.js';

let { abundant, common, uncommon, rare, exotic } = rarity;
let { tiny, medium, large } = size;

const defaults = {
    rarity: common,
};

const config = [
    { name: 'Bell' },
    { name: 'Bone', variants: [ 'finger', 'foot', 'vertebrae' ], size: tiny, quantity: 10 },
    { name: 'Bone', variants: [ 'rib', 'pelvis', 'femur', 'leg', 'arm' ] },
    { name: 'Bones, pile', size: medium },
    { name: 'Candle', rarity: abundant, quantity: 5 },
    { name: 'Canvas', variants: [ '1 foot', '5 feet', '10 feet', '20 foot' ] },
    { name: 'Cloth, bolt', variants: [ 'common', 'fine' ], quantity: 10 },
    { name: 'Cotton', variants: [ '1 foot', '5 feet', '10 feet', '20 foot' ] },
    { name: 'Hide', variants: [ 'wolf', 'bear', 'deer', 'rabbit', 'raccoon', 'beaver' ] },
    { name: 'Incense', rarity: rare },
    { name: 'Instrument', rarity: exotic, variants: [ 'Bagpipes', 'Drum', 'Dulcimer', 'Flute', 'Lute', 'Lyre', 'Horn', 'Pan flute', 'Shawm', 'Viol' ] },
    { name: 'Iron, bar', rarity: uncommon },
    { name: 'Linen', variants: [ '1 foot', '5 feet', '10 feet', '20 foot' ] },
    { name: 'Manacles' },
    { name: 'Perfume', variants: [ 'vial', 'bottle' ] },
    { name: 'Rock', size: large },
    { name: 'Rock', size: medium },
    { name: 'Silk', rarity: rare, variants: [ '1 foot', '5 feet', '10 feet', '20 foot' ] },
    { name: 'Skull' },
    { name: 'Stone', size: tiny },
    { name: 'String', variants: [ '1 foot', '5 feet', '10 feet', '20 foot' ] },
    { name: 'Torch' },
    { name: 'Totem' },
];

export default config.map((item) => ({ ...defaults, ...item }));
