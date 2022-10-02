// @ts-check

import { roll, rollArrayItem, rollPercentile } from '../utility/roll.js';
import { toss } from '../utility/tools.js';

// -- Types --------------------------------------------------------------------

/** @typedef {import('./generate.js').RandomizedRoomConfig} RandomizedRoomConfig */

/** @typedef {typeof roomFeatures[number]} RoomFeature */

// -- Config -------------------------------------------------------------------

/**
 * Percentile chance to include a room feature.
 */
const featureChance = 50;

/**
 * Maximum number of features for a room.
 */
const maxFeatures = 3;

export const roomFeatures = Object.freeze(/** @type {const} */ ([
    'altar',
    'beetles',
    'cage',
    'candles',
    'carvings',
    'caveIn',
    'cobwebs',
    'corpse',
    'embers',
    'fire',
    'fountain',
    'gargoyles',
    'hole',
    'machinery',
    'moths',
    'mouldy',
    'pit',
    'pits',
    'rats',
    'sarcophagi',
    'shackles',
    'spiders',
    'spikes',
    'statue',
    'stream',
    'tapestries',
    'torches',
    'well',
]));

// -- Private Functions --------------------------------------------------------

/**
 * Get feature description
 *
 * @private
 * @throws
 *
 * @param {RoomFeature} roomFeature
 * @param {object} [options]
 *     @param {boolean} [options.variation = number]
 *
 * @returns {string}
 */
function getFeatureDesc(roomFeature, { variation = Boolean(roll()) } = {}) {
    switch (roomFeature) {
        case 'altar': {
            let location = variation ? 'in the center' : 'to one side';
            return `A ritualistic altar sits ${location} of the room`;
        }

        case 'beetles':
            return variation
                ? 'Beetles scurry about'
                : 'Beetles fall from the ceiling';

        case 'cage':
            return variation
                ? 'A large cage occupies the space'
                : 'Small cages are scattered around the room';

        case 'candles':
            return variation
                ? 'Candles that were lit recently flicker and cast shadows around the room'
                : 'Wax from melted candles is splattered on walls and floors';

        case 'carvings':
            return variation
                ? 'Strange carvings have been etched into the walls, floor, and ceiling'
                : 'Crude carvings of faces are chiseled in the walls';

        case 'caveIn':
            return `Part of the ${variation ? 'room' : 'ceiling'} has caved in`;

        case 'cobwebs':
            return variation
                ? 'Massive cobwebs stick to the walls'
                : 'The room is covered with old cobwebs';

        case 'corpse':
            return variation
                ? 'Bones from an old corpse are scattered around the room'
                : 'A rotting corpse sits against a wall';

        case 'embers':
            return variation
                ? 'Scattered embers from a recent fire glow in the room'
                : 'The room contains a small fire ring containing warm embers';

        case 'fire': {
            let fresh = variation ? 'A fresh' : 'An abandoned';
            return `${fresh} campfire burns on the floor`;
        }

        case 'fountain': {
            let flowing = variation
                ? 'still flowing'
                : 'that has long ago stopped running';

            return `The room features a small fountain ${flowing}`;
        }

        case 'gargoyles':
            return variation
                ? 'Small gargoyles line the edge of the ceiling'
                : 'Tow statues of gargoyles site motionless next to the door';

        case 'hole':
            return variation
                ? 'There is a large hole in the floor'
                : 'A small hole has been carved in to the wall';

        case 'machinery':
            return variation
                ? 'Strange ancient machinery fills the room'
                : 'The room contains old mechanical gears and machine parts';

        case 'moths':
            return variation
                ? 'Moths flutter in the air'
                : 'Moth cocoons are stick to the walls and hang from the ceiling';

        case 'mouldy':
            return variation
                ? 'Nasty black mold is growing on the walls like vines'
                : 'The room covered in mould';

        case 'pit': {
            let size = variation ? 'large' : 'small';
            return `A ${size} pit has been dug in the floor`;
        }

        case 'pits': {
            let size = variation ? 'large' : 'small';
            return `${roll(2, 8)} ${size} pits can be seen in the room`;
        }

        case 'rats':
            return variation
                ? 'Rats scatter as you enter the room'
                : 'A large well fed ret looks at you inquisitively';

        case 'sarcophagi':
            return variation
                ? 'A sarcophagus sits undisturbed in the center of the room'
                : `${roll(2, 6)} sarcophagi line the walls of the room`;

        case 'shackles':
            return variation
                ? 'Shackles are attached to the walls'
                : 'Broken shackles litter the floor';

        case 'spiders': {
            let size = variation ? 'tiny' : 'small';
            return `The room is crawling with ${size} spikers`;
        }

        case 'spikes':
            return variation
                ? 'Rusty spikes have been crudely attached to the walls and floors'
                : 'Steel spikes descend from the ceiling';

        case 'statue': {
            let material = variation ? 'stone' : 'wooden';
            return `A ${material} statue sits motionless`;
        }

        case 'stream': {
            let description = variation ? 'small' : 'muddy';
            return `A ${description} stream runs through the room`;
        }

        case 'tapestries': {
            let size = variation ? 'large' : 'small';
            return `Several ${size} tapestries line the walls`;
        }

        case 'torches':
            return variation
                ? 'Lit torches illuminate the walls'
                : 'Smoke from extinguished torches hangs in the room';

        case 'well': {
            let description = variation
                ? 'that appears to have running water'
                : 'with muddy';
            return `The rom features a well ${description} at the bottom`;
        }

        default:
            toss('Invalid room feature');
    }
}

export {
    getFeatureDesc as testGetFeatureDesc,
};

// -- Public Functions ---------------------------------------------------------

/**
 * Get feature description
 *
 * TODO inject probability
 * TODO inject count
 *
 * @param {RandomizedRoomConfig} config
 *
 * @returns {string[]}
 */
export function getRoomFeatures(config) {
    let {
        roomType: roomTypeSetting,
    } = config;

    if (roomTypeSetting === 'hallway') {
        return [];
    }

    // TODO extract noop to caller
    if (!rollPercentile(featureChance)) {
        return [];
    }

    let featureCount = roll(1, maxFeatures);
    let featureTypes = new Set();

    for (let i = 0; i < featureCount; i++) {
        featureTypes.add(rollArrayItem(roomFeatures));
    }

    let features = [ ...featureTypes ].map((type) => {
        return getFeatureDesc(type);
    });

    return features;
}
