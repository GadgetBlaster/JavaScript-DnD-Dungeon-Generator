
import {
    _getFeatureDesc,
    feature,
    getRoomFeatures,
} from '../feature.js';

import { knobs } from '../../knobs.js';
import roomType from '../type.js';

/**
 * @param {import('../../../unit/unit.js').Utility}
 */
export default ({ assert, describe, it }) => {
    describe('`feature`', () => {
        it('should be an object of strings', () => {
            assert(feature).isObject();

            let invalidFeature = Object.values(feature).find((value) => typeof value !== 'string');
            assert(invalidFeature).isUndefined();
        });
    });

    describe('_getFeatureDesc()', () => {
        Object.values(feature).forEach((roomFeature) => {
            describe(`given a room feature of \`${roomFeature}\``, () => {
                it('should return a string', () => {
                    assert(_getFeatureDesc(roomFeature)).isString();
                });
            });
        });

        describe('given an invalid room feature', () => {
            it('should throw', () => {
                assert(() => _getFeatureDesc('captain jim jam')).throws('Invalid room feature');
            });
        });
    });

    describe('_getFeatureDesc()', () => {
        describe('given a room type of `roomType.hallway`', () => {
            it('should return an empy array', () => {
                assert(getRoomFeatures({ [knobs.roomType]: roomType.hallway, })).equalsArray([]);
            });
        });

        // TODO inject probability before adding test coverage.
    });
};
