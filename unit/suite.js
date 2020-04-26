
import assert from './test/tests.assert.js';
import output from './test/tests.output.js';
import run from './test/tests.run.js';
import unit from './test/tests.unit.js';

import html from '../app/utility/test/tests.html.js';
import roll from '../app/utility/test/tests.roll.js';

export default {
    '/test/tests.assert.js': assert,
    '/test/tests.output.js': output,
    '/test/tests.run.js'   : run,
    '/test/tests.unit.js'  : unit,

    '/app/utility/test/tests.html.js': html,
    '/app/utility/test/tests.roll.js': roll,
};
