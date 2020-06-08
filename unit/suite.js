
import assert from './test/tests.assert.js';
import output from './test/tests.output.js';
import run from './test/tests.run.js';
import unit from './test/tests.unit.js';

import action from '../app/ui/test/tests.action.js';
import block from '../app/ui/test/tests.block.js';
import button from '../app/ui/test/tests.button.js';
import field from '../app/ui/test/tests.field.js';
import form from '../app/ui/test/tests.form.js';

import html from '../app/utility/test/tests.html.js';
import roll from '../app/utility/test/tests.roll.js';
import tests from '../app/utility/test/tests.tests.js';
import tools from '../app/utility/test/tests.tools.js';

export default {
    '/unit/test/tests.assert.js': assert,
    '/unit/test/tests.output.js': output,
    '/unit/test/tests.run.js'   : run,
    '/unit/test/tests.unit.js'  : unit,

    '/app/ui/test/tests.action.js': action,
    '/app/ui/test/tests.block.js' : block,
    '/app/ui/test/tests.button.js': button,
    '/app/ui/test/tests.field.js' : field,
    '/app/ui/test/tests.form.js'  : form,

    '/app/utility/test/tests.html.js' : html,
    '/app/utility/test/tests.roll.js' : roll,
    '/app/utility/test/tests.tests.js': tests,
    '/app/utility/test/tests.tools.js': tools,
};
