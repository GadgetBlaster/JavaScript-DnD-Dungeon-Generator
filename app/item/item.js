
import rarity from '../attribute/rarity';
import size from '../attribute/size';

import container from './container';

/**
 * Item
 * 
 * @typedef {Item}
 *  @property {string} name
 *  @property {string} rarity
 *  @property {number} quantity
 *  @property {number} [capacity] - Max number of small items found inside 
 *  @property {string[]} [receptacles]
 *  @property {string[]} [variants]
 */

const defaults = {
    quantity: 1,
    size: size.small,
    rarity: rarity.average,
};

const config = [
    { name: 'Healer’s kit' },
    { name: 'Holy symbol Amulet Emblem' },
    { name: 'Reliquary' },
    { name: 'Holy water (flask)' },
    { name: 'Hourglass' },
    { name: 'Hunting trap' },
    { name: 'Ink (1 ounce bottle)' },
    { name: 'Ink pen' },
    { name: 'Jug or pitcher' },
    { name: 'Ladder (10-foot)' },
    { name: 'Lamp' },
    { name: 'Lantern, bullseye' },
    { name: 'Lantern, hooded' },
    { name: 'Lock' },
    { name: 'Magnifying glass' },
    { name: 'Manacles' },
    { name: 'Mess kit' },
    { name: 'Mirror, steel' },
    { name: 'Oil (flask)' },
    { name: 'Paper (one sheet)' },
    { name: 'Parchment (one sheet)' },
    { name: 'Perfume (vial)' },
    { name: 'Pick, miner’s' },
    { name: 'Piton' },
    { name: 'Poison, basic (vial)' },
    { name: 'Pole (10-foot)' },
    { name: 'Pot, iron' },
    { name: 'Potion of healing' },
    { name: 'Pouch' },
    { name: 'Quiver' },
    { name: 'Ram, portable' },
    { name: 'Rations (1 day)' },
    { name: 'Robes' },
    { name: 'Rope, hempen (50 feet)' },
    { name: 'Rope, silk (50 feet)' },
    { name: 'Sack' },
    { name: 'Scale, merchant’s' },
    { name: 'Sealing wax' },
    { name: 'Shovel' },
    { name: 'Signal whistle' },
    { name: 'Signet ring' },
    { name: 'Soap' },
    { name: 'Spellbook' },
    { name: 'Spikes, iron (10)' },
    { name: 'Spyglass' },
    { name: 'Tent, two-person' },
    { name: 'Tinderbox' },
    { name: 'Torch' },
    { name: 'Vial' },
    { name: 'Waterskin' },
    { name: 'Whetstone' },
];

export const items = config.map((item) => ({ ...defaults, ...item }));
