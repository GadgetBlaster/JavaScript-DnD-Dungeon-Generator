// @ts-check

import rarity from '../../attributes/rarity.js';
import type from '../type.js';

const defaults = {
    quantity: 50,
    rarity  : rarity.common,
    type    : type.ammo,
};

const config = [
    { name: 'Arrow' },
    { name: 'Blowgun needle' },
    { name: 'Crossbow bolt' },
    { name: 'Sling bullet' },
];

export default config.map((item) => ({ ...defaults, ...item }));
