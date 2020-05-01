
/**
 * Run
 *
 * @param {Object} config
 *     @param {string[]} suite
 *     @param {Function} onComplete
 *     @param {Function} onError
 *     @param {Function} runUnits
 *     @param {string} [scope]
 */
export default ({
    onError,
    runUnits,
    scope,
    suite,
}) => {
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

    entries.forEach(([ label, units ]) => {
        if (typeof units !== 'function') {
            onError(`Invalid test function: ${label}`);
        }

        try {
            runUnits(label, units);
        } catch(error) {
            let msg = typeof error === 'object' ? error.stack.toString() : error;
            onError(msg);
        }
    });
};
