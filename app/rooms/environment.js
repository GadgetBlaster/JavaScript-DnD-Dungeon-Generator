
import { getRoomTypeLabel } from './description.js';
import { getVegetationDescription } from './vegetation.js';
import { knobs } from '../knobs.js';
import { roll, rollArrayItem, rollPercentile } from '../utility/roll.js';
import roomType from './type.js';
import size from '../attributes/size.js';
import { getRoomFeatures } from './feature.js';

// -- Config -------------------------------------------------------------------

/**
 * Percentile chance to include an environment detail with a room.
 *
 * @type {number}
 */
const detailChance = 50;

/**
 * Room structure types
 *
 * @type {Object.<string, string>}
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
 *
 * @type {Set<string>}
 */
const supportsVegetation = new Set([
    structure.cave,
    structure.stone,
    structure.stoneWood,
    structure.wood,
]);

/**
 * Air environment types
 *
 * @type {Object.<string, string>}
 */
const air = {
    damp  : 'damp',
    misty : 'misty',
    smelly: 'smelly',
    smokey: 'smokey',
};

/**
 * Ground environment types
 *
 * @type {Object.<string, string>}
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
 *
 * @type {Object.<string, string>}
 */
const wall = {
    bloody   : 'bloody',
    cracked  : 'cracked',
    crumbling: 'crumbling',
    scorched : 'scorched',
    slimy    : 'slimy',
    webs     : 'webs',
};

// -- Private Methods ----------------------------------------------------------

/**
 * Get structure description
 *
 * @param {import('./settings.js').RoomSettings}
 * @param {string} roomStructure
 *
 * @returns {string}
 */
export const _getStructureDesc = (settings, roomStructure) => {
    let {
        [knobs.roomType]: typeSetting,
        [knobs.roomSize]: roomSize,
    } = settings;

    let type = getRoomTypeLabel(typeSetting);

    switch (roomStructure) {
        case structure.cave:
            let isCavern = roomSize === size.massive && typeSetting !== roomType.hallway;
            return `The ${type} is formed by a ${isCavern ? 'cavern' : 'cave'}`;

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
            throw new TypeError('Invalid room structure');
    }
};

/**
 * Returns a ground description for a room
 *
 * TODO inject all probabilities
 *
 @returns {string}
 */
export const _getGroundDesc = () => {
    if (!rollPercentile(detailChance)) {
        return;
    }

    let random = rollArrayItem(Object.keys(ground));

    switch (random) {
        case ground.ashes:
            return 'The floor is covered with ashes';

        case ground.bloody:
            let isFresh = roll() ? 'Fresh blood' : 'Blood stains';
            return `${isFresh} can be seen on the floor`;

        case ground.dirt:
            return 'Dirt covers the ground';

        case ground.flooded:
            let inches = roll();
            return `The room is ${inches ? '' : 'completely '}flooded with a few ${inches ? 'inches' : 'feet'} of water`;

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
            throw new TypeError('Invalid ground type');
    }
};

/**
 * Get wall description
 *
 * TODO inject all probabilities
 *
 * @returns {string}
 */
export const _getWallDesc = () => {
    if (!rollPercentile(detailChance)) {
        return;
    }

    let random = rollArrayItem(Object.keys(wall));

    switch (random) {
        case wall.bloody:
            let isFresh = roll() ? 'Fresh blood is' : 'Blood stains are';
            return `${isFresh} splattered across the walls`;

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
            throw new TypeError('Invalid wall type');
    }
};

/**
 * Get air description
 *
 * TODO inject all probabilities
 *
 * @returns {string}
 */
export const _getAirDesc = () => {
    if (!rollPercentile(detailChance)) {
        return;
    }

    let random = rollArrayItem(Object.keys(air));

    switch (random) {
        case air.damp:
            return 'The air is think and damp';

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

            return 'There is a strange sweet sent in the air';

        case air.smokey:
            return 'The room is filled with smoke from a hastily extinguished fire';

        default:
            throw new TypeError('Invalid air type');
    }
};

// -- Public Methods -----------------------------------------------------------

/**
 * Get environment description
 *
 * @returns {string}
 */
export const getEnvironmentDescription = (settings) => {
    // TODO randomization should be injected
    let roomStructure = rollArrayItem(Object.keys(structure));
    let roomVegetation;

    if (supportsVegetation.has(roomStructure)) {
        roomVegetation = getVegetationDescription();
    }

    return [
        _getStructureDesc(settings, roomStructure),
        _getGroundDesc(),
        _getWallDesc(),
        roomVegetation,
        _getAirDesc(),
        ...getRoomFeatures(settings),
    ].filter(Boolean);
};