// @ts-check

// -- Config -------------------------------------------------------------------

/**
 * Item types
 */
const type = {
    ammo         : 'ammo',
    armor        : 'armor',
    chancery     : 'chancery',
    clothing     : 'clothing',
    coin         : 'coin',
    container    : 'container',
    food         : 'food',
    furnishing   : 'furnishing',
    kitchen      : 'kitchen',
    liquid       : 'liquid',
    miscellaneous: 'miscellaneous',
    mysterious   : 'mysterious',
    mythic       : 'mythic',
    potion       : 'potion',
    survival     : 'survival',
    tack         : 'tack',
    tool         : 'tool',
    treasure     : 'treasure',
    trinket      : 'trinket',
    weapon       : 'weapon',
};

export default type;

export const list = Object.values(type);
