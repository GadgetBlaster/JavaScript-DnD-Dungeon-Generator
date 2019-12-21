
import rarity from '../../attributes/rarity'
import type from '../type';

const defaults = {
    quantity: 200,
    type: type.ammo,
};

const config = [
    { name: 'Arrow' },
    { name: 'Blowgun needle' },
    { name: 'Crossbow bolt' },
    { name: 'Sling bullet' },
];

export default config.map((item) => ({ ...defaults, ...item }));
