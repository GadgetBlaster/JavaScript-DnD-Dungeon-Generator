
import {
    _getVegetationDescription,
    getVegetationDescription,
    vegetation,
} from '../vegetation.js';

import { knobs } from '../../knobs.js';

/**
 * @param {import('../../unit/unit.js').Utility}
 */
export default ({ assert, describe, it }) => {
    describe('`vegetation`', () => {
        it('should be an object of strings', () => {
            assert(vegetation).isObject();

            let invalidVegetation = Object.values(vegetation).find((value) => typeof value !== 'string');
            assert(invalidVegetation).isUndefined();
        });
    });

    describe('_getVegetationDescription()', () => {
        Object.values(vegetation).forEach((roomVegetation) => {
            describe(`given a room vegetation of \`${roomVegetation}\``, () => {
                it('should return a string', () => {
                    assert(_getVegetationDescription(roomVegetation, { variation: false })).isString();
                });
            });

            describe('variations', () => {
                it('should return a string', () => {
                    assert(_getVegetationDescription(roomVegetation, { variation: true })).isString();
                });
            });
        });

        describe('given an invalid room vegetation', () => {
            it('should throw', () => {
                assert(() => _getVegetationDescription('bowling balls')).throws('Invalid vegetation type');
            });
        });
    });

    describe('_getFeatureDesc()', () => {
        /*
        describe('given a count of one', () => {
            it('should return a single vegetation description', () => {
                assert(getVegetationDescription({}, { count: 1 })).stringExcludes(',');
            });
        });

        describe('given a count of two', () => {
            it('should return two vegetation descriptions', () => {
                assert(getVegetationDescription({}, { count: 2 })).stringIncludes('and');
            });
        });

        describe('given a count of three', () => {
            it('should return three vegetation descriptions', () => {
                assert(getVegetationDescription({}, { count: 3 }))
                    .stringIncludes(', ')
                    .stringIncludes('and');
            });
        });
        */

        // TODO inject probability before adding test coverage.
    });
};
