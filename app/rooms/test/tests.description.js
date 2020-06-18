
import {
    _getKeyDetail,
    getKeyDescription,
    getMapDescription,
} from '../description.js';

import { lockable } from '../door.js';
import { directions } from '../../dungeons/map.js';

/**
 * @param {import('../../../unit/unit.js').Utility}
 */
export default ({ assert, describe, it }) => {
    describe('#getMapDescription', () => {
        it('should include a title', () => {
            assert(getMapDescription()).stringIncludes('<h3>Map</h3>');
        });

        it('should include a list with a single item', () => {
            assert(getMapDescription())
                .stringIncludes('<ul><li>')
                .stringIncludes('</li></ul>');
        });
    });

    describe('#_getKeyDetail', () => {
        it('should return a string', () => {
            [ ...lockable, 'Undefined key description for door type' ].forEach((type) => {
                const result = _getKeyDetail(type);
                assert(result).isString();
                assert(result === '').isFalse();
            });
        });
    });

    describe('#getKeyDescription', () => {
        describe('given a set of two keys', () => {
            const keys = [
                {
                    type: 'Any',
                    connections: {
                        1: { direction: directions.north, to: 2 },
                        2: { direction: directions.south, to: 1 },
                    },
                },
                {
                    type: 'Any',
                    connections: {
                        1: { direction: directions.east, to: 23 },
                        23: { direction: directions.west, to: 1 },
                    },
                },
            ];

            const result = getKeyDescription(keys);

            it('should return a string', () => {
                assert(result).isString();
            });

            it('should include a title with the number of keys', () => {
                assert(result).stringIncludes('<h3>Keys (2)</h3>');
            });

            it('should include am html list string with items for each key and the correct room connections', () => {
                const snapshot = '<ul><li>Key to room 1 / 2</li><li>Key to room 1 / 23</li></ul>';
                assert(result).stringIncludes(snapshot);
            });
        });
    });
};
