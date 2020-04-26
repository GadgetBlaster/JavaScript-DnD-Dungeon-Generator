 
/**
 * Run
 *
 * @param {Object} config
 *     @param {string[]} suite
 *     @param {Function} onComplete
 *     @param {Function} onError
 *     @param {Function} runUnits
 *     @param {string} [scope]
 *
 * @returns {Function}
 */
export default ({
    onComplete,
    onError,
    runUnits,
    scope,
    suite,
}) => {
    const exit = (error) => {
        onError(error);
        onComplete();
    };

    if (!suite || typeof suite !== 'object') {
        exit('Invalid test suite');
        return;
    }

    let entries = Object.entries(suite);

    if (!entries.length) {
        exit('Empty test suite');
        return;
    }

    let {
        [scope]: scopedTest,
    } = suite;

    if (scope && !scopedTest) {
        exit(`Invalid test scope: ${scope}`);
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
            onError(error.stack.toString());
        }
    });

    onComplete();
};
