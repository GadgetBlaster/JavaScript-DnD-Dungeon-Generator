
import traps from '../trap.js';

/**
 * @param {import('../../../unit/unit.js').Utility}
 */
export default ({ assert, describe, it }) => {
    describe('`traps`', () => {
        it('should be an array of strings', () => {
            assert(traps).isArray();

            let invalidTrap = traps.find((value) => typeof value !== 'string');
            assert(invalidTrap).isUndefined();
        });
    });
};
