// @ts-check

import { getRoomFeatures } from './feature.js';
import { getRoomLabel } from './description.js';
import { getRoomVegetationDescription } from './vegetation.js';
import { roll, rollArrayItem, rollPercentile } from '../utility/roll.js';
import { toss } from '../utility/tools.js';

// -- Types --------------------------------------------------------------------

/** @typedef {import('./generate').RandomizedRoomConfig} RandomizedRoomConfig */

// -- Config -------------------------------------------------------------------

/**
 * Percentile chance to include an environment detail with a room.
 */
const detailChance = 50;

/**
 * Room structure types
 */
export const structure = {
    cave     : 'cave',
    ice      : 'ice',
    marble   : 'marble',
    stone    : 'stone',
    stoneWood: 'stoneWood',
    wood     : 'wood',
};

/**
 * Set of room types that may contain vegetation.
 */
const supportsVegetation = new Set([
    structure.cave,
    structure.stone,
    structure.stoneWood,
    structure.wood,
]);

/**
 * Air environment types
 */
const air = {
    damp  : 'damp',
    misty : 'misty',
    smelly: 'smelly',
    smokey: 'smokey',
};

/**
 * Ground environment types
 */
const ground = {
    ashes   : 'ashes',
    bloody  : 'bloody',
    dirt    : 'dirt',
    flooded : 'flooded',
    muddy   : 'muddy',
    rubble  : 'rubble',
    slimy   : 'slimy',
    slippery: 'slippery',
    uneven  : 'uneven',
};

/**
 * Wall environment types
 */
const wall = {
    bloody   : 'bloody',
    cracked  : 'cracked',
    crumbling: 'crumbling',
    scorched : 'scorched',
    slimy    : 'slimy',
    webs     : 'webs',
};

// -- Private Functions --------------------------------------------------------

/**
 * Returns a description of a room's air.
 *
 * @throws
 *
 * TODO inject all probabilities
 *
 * @returns {string}
 */
function getAirDesc() {
    if (!rollPercentile(detailChance)) {
        return;
    }

    let random = rollArrayItem(Object.keys(air));

    switch (random) {
        case air.damp:
            return 'The air is thick and damp';

        case air.misty:
            if (roll()) {
                return 'Low mist clings to the ground';
            }

            return 'Mist fills the air';

        case air.smelly:
            if (roll()) {
                return 'A nasty smell fills the room';
            }

            if (roll()) {
                return 'The air smells fresh and crisp';
            }

            return 'There is a strange sweet scent in the air';

        case air.smokey:
            return 'The room is filled with smoke from a hastily extinguished fire';

        default:
            toss('Invalid air type');
    }
}

/**
 * Returns a description of a room's ground.
 *
 * @throws
 *
 * TODO inject all probabilities
 *
 * @returns {string}
 */
function getGroundDesc() {
    if (!rollPercentile(detailChance)) {
        return;
    }

    let random = rollArrayItem(Object.keys(ground));

    switch (random) {
        case ground.ashes:
            return 'The floor is covered with ashes';

        case ground.bloody: {
            let isFresh = roll() ? 'Fresh blood' : 'Blood stains';
            return `${isFresh} can be seen on the floor`;
        }

        case ground.dirt:
            return 'Dirt covers the ground';

        case ground.flooded: {
            return roll()
                ? 'The room is flooded with a boot’s depth of water'
                : 'The room is completely flooded with what appears to be waist deep water';
        }

        case ground.muddy:
            return 'The floor is sticky with mud';

        case ground.rubble:
            return 'Rubble covers the floor';

        case ground.slimy:
            return 'The ground is slimy';

        case ground.slippery:
            return 'The floor is wet and slippery';

        case ground.uneven:
            return 'The ground is extremely uneven';

        default:
            toss('Invalid ground type');
    }
}

/**
 * Returns a description a room's structure.
 *
 * @throws
 *
 * @param {RandomizedRoomConfig} config
 * @param {string} roomStructure
 *
 * @returns {string}
 */
function getStructureDesc(config, roomStructure) {
    let {
        roomType: typeSetting,
        roomSize: roomSize,
    } = config;

    let type = getRoomLabel(typeSetting);

    switch (roomStructure) {
        case structure.cave: {
            let isCavern = roomSize === 'massive' && typeSetting !== 'hallway';
            return `The ${type} is formed by a ${isCavern ? 'cavern' : 'cave'}`;
        }

        case structure.ice:
            return `The ${type} is made entirely of ice`;

        case structure.marble:
            return `The ${type} is built of marble tiles`;

        case structure.stone:
        case structure.wood:
            return `The ${type} is constructed from ${roomStructure}`;

        case structure.stoneWood:
            return `The stone ${type} is reinforced with wooden beams and pillars`;

        default:
            toss('Invalid room structure');
    }
}

/**
 * Returns a description of a room's walls.
 *
 * @throws
 *
 * TODO inject all probabilities
 *
 * @returns {string}
 */
function getWallDesc() {
    if (!rollPercentile(detailChance)) {
        return;
    }

    let random = rollArrayItem(Object.keys(wall));

    switch (random) {
        case wall.bloody: {
            let isFresh = roll() ? 'Fresh blood is' : 'Blood stains are';
            return `${isFresh} splattered across the walls`;
        }

        case wall.cracked:
            return 'The walls are cracked';

        case wall.crumbling:
            return 'The walls are crumbling';

        case wall.scorched:
            return 'The walls appear to have been scorched by fire';

        case wall.slimy:
            return 'Something slimy drips from the walls';

        case wall.webs:
            return 'The walls are covered in thick spider webs';

        default:
            toss('Invalid wall type');
    }
}

export {
    getAirDesc       as testGetAirDesc,
    getGroundDesc    as testGetGroundDesc,
    getStructureDesc as testGetStructureDesc,
    getWallDesc      as testGetWallDesc,
};

// -- Public Functions ---------------------------------------------------------

/**
 * Get environment description
 *
 * TODO return sentences .filter(Boolean).join('. ')+'.');
 *
 * @param {RandomizedRoomConfig} config
 *
 * @returns {string[]}
 */
export function getEnvironmentDescription(config) {
    // TODO randomization should be injected
    let roomStructure = rollArrayItem(Object.keys(structure));
    let roomVegetation;

    if (supportsVegetation.has(roomStructure)) {
        roomVegetation = getRoomVegetationDescription(config);
    }

    return [
        getStructureDesc(config, roomStructure),
        getGroundDesc(),
        getWallDesc(),
        roomVegetation,
        getAirDesc(),
        ...getRoomFeatures(config),
    ].filter(Boolean);
}
