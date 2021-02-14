
import {
    _getAirDesc,
    _getGroundDesc,
    _getStructureDesc,
    _getWallDesc,
    getEnvironmentDescription,
    structure,
} from '../environment.js';

import { getRoomTypeLabel } from '../description.js';
import { knobs } from '../../knobs.js';
import roomType from '../type.js';
import size from '../../attributes/size.js';

/**
 * @param {import('../../unit/unit.js').Utility}
 */
export default ({ assert, describe, it }) => {
    describe('`structure`', () => {
        it('should be an object of strings', () => {
            assert(structure).isObject();

            let invalidStructure = Object.values(structure).find((value) => typeof value !== 'string');
            assert(invalidStructure).isUndefined();
        });
    });

    describe('_getStructureDesc()', () => {
        Object.values(structure).forEach((roomStructure) => {
            describe(`given a room structure of \`${roomStructure}\``, () => {
                let desc = _getStructureDesc({
                    [knobs.roomType]: roomType.bedroom,
                    [knobs.roomSize]: size.medium,
                }, roomStructure);

                it('should return a string', () => {
                    assert(desc).isString();
                });

                it('should include the room type label', () => {
                    assert(desc).stringIncludes(getRoomTypeLabel(roomType.bedroom));
                });
            });
        });

        describe('given an invalid structure', () => {
            it('should throw', () => {
                assert(() => _getStructureDesc({
                    [knobs.roomType]: roomType.bedroom,
                    [knobs.roomSize]: size.medium,
                }, 'very small rocks')).throws('Invalid room structure');
            });
        });

        describe('given a room structure of `structure.cave`', () => {
            describe('when the room size is `size.massive`', () => {
                it('should include "cavern" and not "cave"', () => {
                    let desc = _getStructureDesc({
                        [knobs.roomType]: roomType.room,
                        [knobs.roomSize]: size.massive,
                    }, structure.cave);

                    assert(desc).stringIncludes('cavern');
                });

                describe('when the room type is `roomType.hallway`', () => {
                    it('should include "cave" and not "cavern"', () => {
                        let desc = _getStructureDesc({
                            [knobs.roomType]: roomType.hallway,
                            [knobs.roomSize]: size.massive,
                        }, structure.cave);

                        assert(desc).stringIncludes('cave');
                        assert(desc).stringExcludes('cavern');
                    });
                });
            });

            describe('when the room size is not `size.massive`', () => {
                it('should include "cave" and not "cavern"', () => {
                    let desc = _getStructureDesc({
                        [knobs.roomType]: roomType.room,
                        [knobs.roomSize]: size.medium,
                    }, structure.cave);

                    assert(desc).stringIncludes('cave');
                    assert(desc).stringExcludes('cavern');
                });
            });
        });
    });

    describe('_getGroundDesc()', () => {
        // TODO inject probabilities
        // it('should return a string', () => {
        //     assert(_getGroundDesc()).isString();
        // });
    });

    describe('_getWallDesc()', () => {
        // TODO inject probabilities
        // it('should return a string', () => {
        //     assert(_getWallDesc()).isString();
        // });
    });

    describe('_getAirDesc()', () => {
        // TODO inject probabilities
        // it('should return a string', () => {
        //     assert(_getAirDesc()).isString();
        // });
    });

    describe('getEnvironmentDescription()', () => {
        it('should return an array of strings', () => {
            let descriptionParts = getEnvironmentDescription({
                [knobs.roomType]: roomType.laboratory,
                [knobs.roomSize]: size.medium,
            });

            assert(descriptionParts).isArray();

            let invalidDescription = descriptionParts.find((desc) => typeof desc !== 'string');
            assert(invalidDescription).isUndefined();
        });
    });
};
