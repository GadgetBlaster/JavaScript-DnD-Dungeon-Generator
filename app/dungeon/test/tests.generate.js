// @ts-check

import {
    // Config
    testComplexityMultiplierMaxXY     as complexityMultiplierMaxXY,
    testComplexityMultiplierMinXY     as complexityMultiplierMinXY,
    testComplexityRoomCountMultiplier as complexityRoomCountMultiplier,
    testTrapCountMultiplier           as trapCountMultiplier,

    // Private Functions
    testGenerateMapDimensions as generateMapDimensions,
    testGenerateTraps         as generateTraps,
    testGetMaxRoomCount       as getMaxRoomCount,

    // Public functions
    generateDungeon,
} from '../generate.js';

import trapList from '../../room/trap.js';

/**
 * @typedef {import('../../controller/knobs.js').DungeonConfig} DungeonConfig
 */

/**
 * @param {import('../../unit/state.js').Utility} utility
 */
export default ({ assert, describe, it }) => {

    // -- Private Functions ----------------------------------------------------

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

        /** @type {Omit<DungeonConfig, "roomCount">} */
        const config = {
            dungeonComplexity    : complexity,
            dungeonConnections   : 0,
            dungeonMaps          : 0,
            dungeonTraps         : 0,
            itemCondition        : 'average',
            itemQuantity         : 'zero',
            itemRarity           : 'average',
            itemType             : 'miscellaneous',
            roomCondition        : 'average',
            roomFurnitureQuantity: 'none',
            roomSize             : 'medium',
            roomType             : 'room',
        };

        const dungeon = generateDungeon(config);

        it('should return a `Dungeon` object', () => {
            assert(dungeon).isObject();
            assert(dungeon.mapSvg).isString();
            assert(/<svg(.*?)>(.*?)<\/svg>/.test(dungeon.mapSvg)).isTrue();
            assert(dungeon.rooms).isArray();
        });

        it('generates a number of `Room` config less than or equal to the max room count', () => {
            assert(dungeon.rooms.length < getMaxRoomCount(complexity)).isTrue();
        });

        describe('required configs', () => {
            [
                'dungeonComplexity',
                'dungeonConnections',
                'dungeonMaps',
                'dungeonTraps',
            ].forEach((requiredConfig) => {
                describe(`given no \`${requiredConfig}\``, () => {
                    const incompleteConfig = { ...config };
                    delete incompleteConfig[requiredConfig];

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
