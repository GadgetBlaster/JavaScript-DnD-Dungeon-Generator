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
    testGetMxRoomCount        as getMxRoomCount,

    // Public functions
    generateDungeon,
} from '../generate.js';

import trapList from '../../room/trap.js';

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

            it('should return a `GridDimensions` object', () => {
                assert(width).isNumber();
                assert(height).isNumber();
            });

            it('`gridWidth` should be between the calculated min and max', () => {
                assert(width >= min).isTrue();
                assert(width <= max).isTrue();
            });

            it('`gridHeight` should be between the calculated min and max', () => {
                assert(height >= min).isTrue();
                assert(height <= max).isTrue();
            });
        });
    });

    describe('generateTraps()', () => {
        describe('given a minimum trap count of 0', () => {
            it('should return an empty array', () => {
                assert(generateTraps(0)).equalsArray([]);
            });
        });

        describe('given a minimum trap count of 1', () => {
            const traps = generateTraps(1);

            it('should return an array', () => {
                assert(traps).isArray();
            });

            it('should return an array of traps', () => {
                assert(traps.find((trap) => !trapList.includes(trap))).isUndefined();
            });

            it('should return an array length between 1 and `trapCountMultiplier`', () => {
                assert(traps.length >= 1).isTrue();
                assert(traps.length <= 5).isTrue();
            });
        });

        describe('given a minimum trap count of 12', () => {
            const min   = 12;
            const traps = generateTraps(min);

            it('should return an array length between 12 and 12 * `trapCountMultiplier`', () => {
                const max = min * trapCountMultiplier;

                assert(traps.length >= min).isTrue();
                assert(traps.length <= max).isTrue();
            });
        });
    });

    describe('getMxRoomCount()', () => {
        it('should return the given `complexity` multiplied by `complexityRoomCountMultiplier`', () => {
            const complexity = 9;
            assert(getMxRoomCount(complexity)).equals(complexity * complexityRoomCountMultiplier);
        });
    });

    // -- Public Functions ----------------------------------------------------

    describe('generateDungeon()', () => {
        const complexity = 3;

        const config = {
            dungeonComplexity : complexity,
            dungeonConnections: 0,
            dungeonMaps       : 0,
            dungeonTraps      : 0,
            itemCondition     : 'average',
            itemQuantity      : 'zero',
            itemRarity        : 'average',
            itemType          : 'miscellaneous',
            roomCondition     : 'average',
            roomSize          : 'medium',
            roomType          : 'room',
        };

        const dungeon = generateDungeon(config);

        it('should return a `Dungeon` object', () => {
            assert(dungeon).isObject();
            assert(dungeon.map).isString();
            assert(/<svg(.*?)>(.*?)<\/svg>/.test(dungeon.map)).isTrue();
            assert(dungeon.rooms).isArray();
            assert(dungeon.mapDimensions).isObject();
            assert(dungeon.mapDimensions.gridWidth).isNumber();
            assert(dungeon.mapDimensions.gridHeight).isNumber();
        });

        it('should generate a number of `Room` config less than or equal to the max room count', () => {
            assert(dungeon.rooms.length < getMxRoomCount(complexity)).isTrue();
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

                    it('should throw', () => {
                        // @ts-expect-error
                        assert(() => generateDungeon(incompleteConfig))
                            .throws(`${requiredConfig} is required in generateDungeon()`);
                    });
                });
            });
        });

        // TODO incomplete test coverage: traps, keys, maps
    });

};
