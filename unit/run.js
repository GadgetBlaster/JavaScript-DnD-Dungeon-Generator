
/**
 * Run
 *
 * @param {Unit} unit
 * @param {Object.<string, Function>} suite
 * @param {string} [scope]
 *
 * @returns {Summary}
 */
export default ({ getSummary, onError, runUnits}, suite, scope) => {
    if (!suite || typeof suite !== 'object') {
        onError('Invalid test suite');
        return;
    }

    let entries = Object.entries(suite);

    if (!entries.length) {
        onError('Empty test suite');
        return;
    }

    let {
        [scope]: scopedTest,
    } = suite;

    if (scope && !scopedTest) {
        onError(`Invalid test scope: ${scope}`);
        return;
    }

    if (scopedTest) {
        entries = [ [ scope, scopedTest ] ];
    }

    entries.forEach(([ label, tests ]) => {
        if (typeof tests !== 'function') {
            onError(`Invalid test function: ${label}`);
        }

        try {
            runUnits(label, tests);
        } catch(error) {
            let msg = typeof error === 'object' ? error.stack.toString() : error;
            onError(msg);
        }
    });

    return getSummary();
};
