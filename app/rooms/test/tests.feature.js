// @ts-check

import {
    // Private Functions
    testGetFeatureDesc as getFeatureDesc,

    // Public Functions
    feature,
    getRoomFeatures,
} from '../feature.js';

import { knobs } from '../../knobs.js';
import roomType from '../type.js';

/**
 * @param {import('../../unit/state.js').Utility} utility
 */
export default ({ assert, describe, it }) => {

    // -- Private Functions ----------------------------------------------------

    describe('getFeatureDesc()', () => {
        Object.values(feature).forEach((roomFeature) => {
            describe(`given a room feature of \`${roomFeature}\``, () => {
                it('should return a string', () => {
                    assert(getFeatureDesc(roomFeature, { variation: false })).isString();
                });
            });

            describe('variations', () => {
                it('should return a string', () => {
                    assert(getFeatureDesc(roomFeature, { variation: true })).isString();
                });
            });
        });

        describe('given an invalid room feature', () => {
            it('should throw', () => {
                assert(() => getFeatureDesc('captain jim jam')).throws('Invalid room feature');
            });
        });
    });

    describe('getFeatureDesc()', () => {
        describe('given a room type of `roomType.hallway`', () => {
            it('should return an empty array', () => {
                // TODO
                assert(getRoomFeatures({ [knobs.roomType]: roomType.hallway })).equalsArray([]);
            });
        });

        // TODO inject probability before adding test coverage.
    });

    // -- Public Functions -----------------------------------------------------

    describe('getRoomFeatures()', () => {
        // TODO
    });

};
