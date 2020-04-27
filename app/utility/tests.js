
import run from '../../unit/run.js';
import suite from '../../unit/suite.js';
import unit from '../../unit/unit.js';

import { element } from './../utility/html.js';
import { plural } from './../utility/tools.js';

/**
 * Run tests and return test summary UI
 *
 * @returns {string}
 */
export default () => {
    let output = '';

    /** @type {Unit} */
    const { getSummary, runUnits, onError } = unit();

    const onComplete = () => {
        /** @type {Summary} */
        let { assertions, errors, failures } = getSummary();

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

        output = report;
    };

    run({ suite, onComplete, onError, runUnits });

    return output;
};
