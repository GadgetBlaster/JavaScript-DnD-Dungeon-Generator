// @ts-check

import {
    // Private Functions
    testGetAirDesc       as getAirDesc,
    testGetGroundDesc    as getGroundDesc,
    testGetStructureDesc as getStructureDesc,
    testGetWallDesc      as getWallDesc,

    // Public Functions
    getEnvironmentDescription,
    structure,
} from '../environment.js';

import { getRoomLabel } from '../description.js';

/**
 * @param {import('../../unit/state.js').Utility} utility
 */
export default ({ assert, describe, it }) => {

    // -- Private Functions ----------------------------------------------------

    describe('getAirDesc()', () => {
        // TODO inject probabilities
        // it('should return a string', () => {
        //     assert(getAirDesc()).isString();
        // });
    });

    describe('getGroundDesc()', () => {
        // TODO inject probabilities
        // it('should return a string', () => {
        //     assert(getGroundDesc()).isString();
        // });
    });

    describe('getStructureDesc()', () => {
        Object.values(structure).forEach((roomStructure) => {
            describe(`given a room structure of \`${roomStructure}\``, () => {
                const desc = getStructureDesc({
                    roomType: 'bedroom',
                    roomSize: 'medium',
                }, roomStructure);

                it('should return a string', () => {
                    assert(desc).isString();
                });

                it('should include the room type label', () => {
                    assert(desc).stringIncludes(getRoomLabel('bedroom'));
                });
            });
        });

        describe('given an invalid structure', () => {
            it('should throw', () => {
                assert(() => getStructureDesc({
                    roomType: 'bedroom',
                    roomSize: 'medium',
                }, 'very small rocks')).throws('Invalid room structure');
            });
        });

        describe('given a room structure of `structure.cave`', () => {
            describe('when the room size is `size.massive`', () => {
                it('should include "cavern" and not "cave"', () => {
                    const desc = getStructureDesc({
                        roomType: 'room',
                        roomSize: 'massive',
                    }, structure.cave);

                    assert(desc).stringIncludes('cavern');
                });

                describe('when the room type is "hallway"', () => {
                    it('should include "cave" and not "cavern"', () => {
                        const desc = getStructureDesc({
                            roomType: 'hallway',
                            roomSize: 'massive',
                        }, structure.cave);

                        assert(desc).stringIncludes('cave');
                        assert(desc).stringExcludes('cavern');
                    });
                });
            });

            describe('when the room size is not `size.massive`', () => {
                it('should include "cave" and not "cavern"', () => {
                    const desc = getStructureDesc({
                        roomType: 'room',
                        roomSize: 'medium',
                    }, structure.cave);

                    assert(desc).stringIncludes('cave');
                    assert(desc).stringExcludes('cavern');
                });
            });
        });
    });

    describe('getWallDesc()', () => {
        // TODO inject probabilities
        // it('should return a string', () => {
        //     assert(getWallDesc()).isString();
        // });
    });

    // -- Public Functions -----------------------------------------------------

    describe('getEnvironmentDescription()', () => {
        it('should return an array of strings', () => {
            const descriptionParts = getEnvironmentDescription({
                roomType: 'laboratory',
                roomSize: 'medium',
            });

            assert(descriptionParts).isArray();

            const invalidDescription = descriptionParts.find((desc) => typeof desc !== 'string');
            assert(invalidDescription).isUndefined();
        });
    });
};
