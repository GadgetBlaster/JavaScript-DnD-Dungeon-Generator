// @ts-check

import { getErrorMessage } from '../utility/tools.js';

// -- Type Imports -------------------------------------------------------------

/** @typedef {import('./state.js').Utility} Utility */
/** @typedef {import('./state').State} State */
/** @typedef {import('./state').Summary} Summary */

// -- Public Functions ---------------------------------------------------------

/**
 * Run suite
 *
 * @param {State} state
 * @param {{ [path: string]: (Utility) => void }} suite
 * @param {string} [scope]
 *
 * @returns {Summary | undefined}
 */
export default function ({ getSummary, onError, runUnits }, suite, scope) {
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
        [scope || '']: scopedTest,
    } = suite;

    if (scope && !scopedTest) {
        onError(`Invalid test scope: ${scope}`);
        return;
    }

    if (scope && scopedTest) {
        entries = [ [ scope, scopedTest ] ];
    }

    entries.forEach(([ path, tests ]) => {
        if (typeof tests !== 'function') {
            onError(`Invalid test function: ${path}`);
            return;
        }

        try {
            runUnits(path, tests);
        } catch (error) {
            onError(getErrorMessage(error));
        }
    });

    return getSummary();
}
