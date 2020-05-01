
import run from '../../unit/run.js';
import suite from '../../unit/suite.js';
import unit from '../../unit/unit.js';

import { element } from './../utility/html.js';
import { plural } from './../utility/tools.js';

/**
 * Get output
 *
 * @param {Summary} summary
 *
 * @returns {string}
 */
export const getOutput = ({ assertions, errors, failures }) => {
    let report = element('p', `Checked for ${assertions} mischievous ${plural(assertions, 'kobold')}.`);

    if (failures || errors.length) {
        let failureText = ` ${failures} ${plural(failures, 'ogre')}`;
        let errorText   = ` ${errors.length} ${plural(errors.length, 'dragon')}`;

        let encounterText = 'Encountered';
        encounterText += failures ? failureText : '';
        encounterText += failures && errors.length ? ' and' : '';
        encounterText += errors.length ? errorText : '';
        encounterText += errors.length ? '!' : '.';

        let linkAttrs = { 'data-error': true, 'href': './unit.html' };

        report += ' ' + element('p', element('a', encounterText, linkAttrs));
    }

    return report;
};

/**
 * Run tests and return test summary UI
 *
 * @returns {string}
 */
export default () => {
    /** @type {Unit} */
    let { getSummary, runUnits, onError } = unit();

    run({ suite, onError, runUnits });

    return getOutput(getSummary());
};
