
import rarity from '../../attributes/rarity';
import type from '../type';

const defaults = {
    rarity: rarity.abundant,
    type: type.clothing,
};

const config = [
    { name: 'Clothes, set', variants: [ 'common', 'costume', 'fine', 'traveler’s' ] },
    { name: 'Robes' },
];

export default config.map((item) => ({ ...defaults, ...item }));
