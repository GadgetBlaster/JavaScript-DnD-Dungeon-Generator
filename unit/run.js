
/**
 * Run suite
 *
 * @param {Unit} unit
 * @param {object.<string, function>} suite
 * @param {string} [scope]
 *
 * @returns {import('./unit').Summary}
 */
export default ({ getSummary, onError, runUnits }, suite, scope) => {
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

    entries.forEach(([ path, tests ]) => {
        if (typeof tests !== 'function') {
            onError(`Invalid test function: ${path}`);
        }

        try {
            runUnits(path, tests);
        } catch(error) {
            let msg = typeof error === 'object' ? error.stack.toString() : error;
            onError(msg);
        }
    });

    return getSummary();
};
