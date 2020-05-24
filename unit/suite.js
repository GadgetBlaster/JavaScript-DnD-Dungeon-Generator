
import assert from './test/tests.assert.js';
import output from './test/tests.output.js';
import run from './test/tests.run.js';
import unit from './test/tests.unit.js';

import html from '../app/utility/test/tests.html.js';
import roll from '../app/utility/test/tests.roll.js';
import tests from '../app/utility/test/tests.tests.js';

export default {
    '/unit/test/tests.assert.js': assert,
    '/unit/test/tests.output.js': output,
    '/unit/test/tests.run.js'   : run,
    '/unit/test/tests.unit.js'  : unit,

    '/app/utility/test/tests.html.js': html,
    '/app/utility/test/tests.roll.js': roll,
    '/app/utility/test/tests.tests.js': tests,
};
