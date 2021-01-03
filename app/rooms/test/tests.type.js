
import roomType, {
    appendRoomTypes,
    list as roomTypes,
    probability,
} from '../type.js';

/**
 * @param {import('../../../unit/unit.js').Utility}
 */
export default ({ assert, describe, it }) => {
    describe('`roomTypes`', () => {
        it('should be an object', () => {
            assert(roomType).isObject();

            let invalidRoomType = Object.keys(roomType).find((value) => typeof value !== 'string');
            assert(invalidRoomType).isUndefined();
        });
    });

    describe('`appendRoomTypes`', () => {
        it('should be a set of room types object', () => {
            let invalidRoomType = [ ...appendRoomTypes ].find((type) => !roomTypes.includes(type));
            assert(invalidRoomType).isUndefined();
        });
    });

    describe('`probability`', () => {
        it('should be a probability object', () => {
            assert(probability.description).isString();
            assert(probability.roll).isFunction();
        });
    });
};
