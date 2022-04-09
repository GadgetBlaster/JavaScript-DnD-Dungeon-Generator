// @ts-check

import ammo from './types/ammo.js';
import armor from './types/armor.js';
import chancery from './types/chancery.js';
import clothing from './types/clothing.js';
import coin from './types/coin.js';
import container from './types/container.js';
import food from './types/food.js';
import kitchen from './types/kitchen.js';
import liquid from './types/liquid.js';
import miscellaneous from './types/miscellaneous.js';
import mysterious from './types/mysterious.js';
import mystic from './types/mystic.js';
import potion from './types/potion.js';
import survival from './types/survival.js';
import tack from './types/tack.js';
import tool from './types/tool.js';
import treasure from './types/treasure.js';
import trinket from './types/trinket.js';
import weapon from './types/weapon.js';

// -- Type Imports -------------------------------------------------------------

/** @typedef {import('./item.js').ItemPartial} ItemPartial */

// -- Config -------------------------------------------------------------------

/** @type {ItemPartial[]} */
export default [
    ...ammo,
    ...armor,
    ...chancery,
    ...clothing,
    ...coin,
    ...container,
    ...food,
    ...kitchen,
    ...liquid,
    ...miscellaneous,
    ...mysterious,
    ...mystic,
    ...potion,
    ...survival,
    ...tack,
    ...tool,
    ...treasure,
    ...trinket,
    ...weapon,
];
