// @ts-check

import {
    // Config
    testComplexityMultiplierMaxXY     as complexityMultiplierMaxXY,
    testComplexityMultiplierMinXY     as complexityMultiplierMinXY,
    testComplexityRoomCountMultiplier as complexityRoomCountMultiplier,
    testTrapCountMultiplier           as trapCountMultiplier,

    // Private Functions
    testDistributeKeys        as distributeKeys,
    testDistributeMaps        as distributeMaps,
    testGenerateMapDimensions as generateMapDimensions,
    testGenerateTraps         as generateTraps,
    testGetMaxRoomCount       as getMaxRoomCount,

    // Public functions
    generateDungeon,
} from '../generate.js';

import trapList from '../../room/trap.js';

/** @typedef {import('../../controller/knobs.js').Config} Config */
/** @typedef {import('../../controller/knobs.js').DungeonConfig} DungeonConfig */
/** @typedef {import('../../room/door.js').DoorKey} DoorKey */
/** @typedef {import('../../room/generate.js').RandomizedRoomConfig} RandomizedRoomConfig */
/** @typedef {import('../../item/generate.js').ItemSet} ItemSet */
/** @typedef {import('../map.js').AppliedRoom} AppliedRoom */

/** @type {RandomizedRoomConfig} */
const randomizedRoomConfig = {
    itemQuantity         : 'zero',
    roomCondition        : 'average',
    roomFurnitureQuantity: 'average',
    roomSize             : 'small',
    roomType             : 'room',
};

/** @type {ItemSet} */
const itemSet = { items: [], containers: [] };

/** @type {AppliedRoom} */
const room = {
    itemSet,
    roomNumber: 1,
    config    : randomizedRoomConfig,
    walls     : [],
    rectangle : { x: 1, y: 1, width: 1, height: 1 },
};

/**
 * @param {import('../../unit/state.js').Utility} utility
 */
export default ({ assert, describe, it }) => {

    // -- Private Functions ----------------------------------------------------

    describe('distributeKeys()', () => {
        it('distributes all keys into rooms', () => {
            /** @type {DoorKey[]} */
            const keys = [
                { type: 'secret', connect: { 1: { direction: 'north', to: 0 }} },
                { type: 'iron', connect: { 1: { direction: 'east', to: 2 }, 2: { direction: 'west', to: 1 }} },
            ];

            /** @type {AppliedRoom[]} */
            const rooms = [ room, { ...room, roomNumber: 2 }, { ...room, roomNumber: 3 } ];

            distributeKeys(keys, rooms);

            let distributedKeys = rooms.reduce((acc, roomConfig) => {
                return [ ...acc, ...(roomConfig?.keys || []) ];
            }, /** @type {DoorKey[]} */ ([]));

            assert(distributedKeys.length).equals(2);
            assert(distributedKeys.some(({ type }) => type === 'secret')).isTrue();
            assert(distributedKeys.some(({ type }) => type === 'iron')).isTrue();
        });
    });

    describe('distributeMaps()', () => {
        it('distributes maps into rooms', () => {
            /** @type {AppliedRoom[]} */
            const rooms = [ room, { ...room, roomNumber: 2 }, { ...room, roomNumber: 3 } ];

            distributeMaps(1, rooms);

            assert(rooms.filter(({ map }) => map).length).equals(1);
        });
    });

    describe('generateMapDimensions()', () => {
        describe('given a complexity of 2', () => {
            const complexity = 2;
            const dimensions = generateMapDimensions(complexity);

            const min = complexity * complexityMultiplierMinXY;
            const max = complexity * complexityMultiplierMaxXY;

            const { width, height } = dimensions;

            it('returns a `GridDimensions` object', () => {
                assert(width).isNumber();
                assert(height).isNumber();
            });

            it('`gridWidth` is between the calculated min and max', () => {
                assert(width >= min).isTrue();
                assert(width <= max).isTrue();
            });

            it('`gridHeight` is between the calculated min and max', () => {
                assert(height >= min).isTrue();
                assert(height <= max).isTrue();
            });
        });
    });

    describe('generateTraps()', () => {
        describe('given a minimum trap count of 0', () => {
            it('returns an empty array', () => {
                assert(generateTraps(0)).equalsArray([]);
            });
        });

        describe('given a minimum trap count of 1', () => {
            const traps = generateTraps(1);

            it('returns an array', () => {
                assert(traps).isArray();
            });

            it('returns an array of traps', () => {
                assert(traps.find((trap) => !trapList.includes(trap))).isUndefined();
            });

            it('returns an array length between 1 and `trapCountMultiplier`', () => {
                assert(traps.length >= 1).isTrue();
                assert(traps.length <= 5).isTrue();
            });
        });

        describe('given a minimum trap count of 12', () => {
            const min   = 12;
            const traps = generateTraps(min);

            it('returns an array length between 12 and 12 * `trapCountMultiplier`', () => {
                const max = min * trapCountMultiplier;

                assert(traps.length >= min).isTrue();
                assert(traps.length <= max).isTrue();
            });
        });
    });

    describe('getMaxRoomCount()', () => {
        it('returns the given `complexity` multiplied by `complexityRoomCountMultiplier`', () => {
            const complexity = 9;
            assert(getMaxRoomCount(complexity)).equals(complexity * complexityRoomCountMultiplier);
        });
    });

    // -- Public Functions ----------------------------------------------------

    describe('generateDungeon()', () => {
        const complexity = 3;

        /** @type {Config} */
        const config = {
            maps: {
                dungeonName          : 'Dungeon test!',
                dungeonComplexity    : complexity,
                dungeonConnections   : 0,
                dungeonMaps          : 0,
                dungeonTraps         : 0,
            },
            items: {
                itemCondition        : 'average',
                itemQuantity         : 'zero',
                itemRarity           : 'average',
                itemType             : 'miscellaneous',
            },
            rooms: {
                roomCondition        : 'average',
                roomFurnitureQuantity: 'none',
                roomSize             : 'medium',
                roomType             : 'room',
            },
        };

        const dungeon = generateDungeon(config);

        it('should return a `Dungeon` object', () => {
            assert(dungeon).isObject();
            assert(dungeon.name).equals('Dungeon test!');
            assert(dungeon.rooms).isArray();
            assert(dungeon.doors).isArray();
            assert(dungeon.dimensions).isObject();
            assert(dungeon.dimensions.width).isNumber();
            assert(dungeon.dimensions.height).isNumber();
        });

        it('generates a number of `Room` configs less than or equal to the max room count', () => {
            assert(dungeon.rooms.length < getMaxRoomCount(complexity)).isTrue();
        });

        describe('given a config with no `maps` property', () => {
            const incompleteConfig = { ...config };
            delete incompleteConfig?.maps;

            it('throws', () => {
                assert(() => generateDungeon(incompleteConfig))
                    .throws(`config.maps is required in generateDungeon()`);
            });
        });

        describe('required configs', () => {
            [
                'dungeonName',
                'dungeonComplexity',
                'dungeonConnections',
                'dungeonMaps',
                'dungeonTraps',
            ].forEach((requiredConfig) => {
                describe(`given no \`${requiredConfig}\``, () => {
                    /** @type {Config} */
                    const incompleteConfig = {
                        ...config,
                        maps: /** @type {DungeonConfig} */ ({ ...config.maps }),
                    };

                    delete incompleteConfig?.maps?.[requiredConfig];

                    it('throws', () => {
                        assert(() => generateDungeon(incompleteConfig))
                            .throws(`${requiredConfig} is required in generateDungeon()`);
                    });
                });
            });
        });

        // TODO incomplete test coverage: traps, keys, maps
    });

};
