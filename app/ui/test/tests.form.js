// @ts-check

import {
    // Private Functions
    testFormatKnobAccordions as formatKnobAccordions,
    testGetFields            as getFields,
    testGetKnob              as getKnob,

    // Public Functions
    getFormData,
    getKnobPanel,
} from '../form.js';

import { parseHtml } from '../../utility/element.js';

/** @typedef {import('../../controller/knobs.js').KnobFieldConfig} KnobFieldConfig */

/** @type {KnobFieldConfig} */
const fakeKnob = {
    label: 'Tools',
    name: 'dungeonComplexity',
    desc: 'How complex should it be?',
    type: 'range',
};

/**
 * @param {import('../../unit/state.js').Utility} utility
 */
export default ({ assert, describe, it }) => {

    // -- Private Functions ----------------------------------------------------

    describe('formatKnobAccordions()', () => {
        describe('given an empty array', () => {
            it('returns an empty string', () => {
                assert(formatKnobAccordions([])).equals('');
            });
        });

        describe('given a knob config', () => {
            const result = formatKnobAccordions([ {
                fields: [],
                generators : new Set([ 'items' ]),
                label : 'Shovels And Spades',
            } ]);

            const fieldset = parseHtml(result).querySelector('fieldset');

            it('contains an HTML fieldset element', () => {
                assert(Boolean(fieldset)).isTrue();
            });

            it('has the correct data-id', () => {
                assert(fieldset).hasAttributes({ 'data-id': 'fieldset-shovels-and-spades' });
            });

            it('contains an accordion button associated to the fieldset', () => {
                assert(fieldset.querySelector('button[data-action="accordion"]'))
                    .hasAttributes({
                        'data-target': 'fieldset-shovels-and-spades',
                    });
            });

            it('does not collapse the first section', () => {
                assert(fieldset).hasAttributes({ 'data-accordion': 'expanded' });
            });
        });

        describe('given an array of fields', () => {
            /** @type {KnobFieldConfig[]} */
            const fields = [
                { name: 'roomSize',     label: 'Room Size',     desc: 'test',  type: 'number'                  },
                { name: 'itemQuantity', label: 'Item Quantity', desc: 'test2', type: 'range'                   },
                { name: 'dungeonTraps', label: 'Traps',         desc: 'test3', type: 'select', values: [ '1' ] },
            ];

            const body = parseHtml(formatKnobAccordions([ {
                fields,
                generators : new Set([ 'items' ]),
                label: 'Shovels',
            } ]));

            it('contains input and label elements for each knob', () => {
                fields.forEach(({ name, label }) => {
                    /** @type {HTMLElement} */
                    const knob = body.querySelector(`[name="${name}"]`);

                    assert(Boolean(knob)).isTrue();
                    knob && assert(body.querySelector(`label[for="${knob.id}"]`).textContent)
                        .stringIncludes(label);
                });
            });
        });

        describe('given multiple knob configs', () => {
            it('collapses all sections except the first', () => {
                const body = parseHtml(formatKnobAccordions([
                    { label: 'Shovels',         fields: [], generators: new Set() },
                    { label: 'Gardening Tools', fields: [], generators: new Set() },
                    { label: 'Weed Whackers',   fields: [], generators: new Set() },
                ]));

                const fieldsets = body.querySelectorAll('fieldset');

                assert(fieldsets.length).equals(3);
                assert(fieldsets[0]).hasAttributes({ 'data-accordion': 'expanded',  'data-id': 'fieldset-shovels'         });
                assert(fieldsets[1]).hasAttributes({ 'data-accordion': 'collapsed', 'data-id': 'fieldset-gardening-tools' });
                assert(fieldsets[2]).hasAttributes({ 'data-accordion': 'collapsed', 'data-id': 'fieldset-weed-whackers'   });
            });
        });
    });

    describe('getFields()', () => {
        describe('given an empty array', () => {
            it('returns an empty string', () => {
                assert(getFields([])).equals('');
            });
        });

        describe('given a knob with no name', () => {
            it('throws', () => {
                const knob = { ...fakeKnob };
                delete knob.name;

                assert(() => getFields([ knob ]))
                    .throws('Missing required knob name');
            });
        });

        describe('given a knob with no label', () => {
            it('throws', () => {
                const knob = { ...fakeKnob };
                delete knob.label;

                assert(() => getFields([ knob ]))
                    .throws('Missing required knob label');
            });
        });

        describe('given a knob with no description', () => {
            it('throws', () => {
                const knob = { ...fakeKnob };
                delete knob.desc;

                assert(() => getFields([ knob ]))
                    .throws('Missing required knob description');
            });
        });

        describe('given a config for a single knob', () => {
            /** @type {KnobFieldConfig} */
            const knobConfig = { name: 'dungeonComplexity', label: 'Complexity', desc: 'Pi', type: 'range' };

            const body   = parseHtml(getFields([ knobConfig ]));
            const input  = body.querySelector('input');

            it('contains an input element with the correct name', () => {
                assert(Boolean(input)).isTrue();
                input && assert(input).hasAttributes({ name: 'dungeonComplexity' });
            });

            it('contains a html label element associated to an input', () => {
                const label = body.querySelector('label');

                assert(Boolean(label)).isTrue();
                label && assert(label.textContent).stringIncludes('Complexity'); // TODO equals
                label && input && assert(label).hasAttributes({ for: input.id });
            });

            it('contains an info button element with the correct target', () => {
                const button = body.querySelector('button');

                assert(Boolean(button)).isTrue();
                button && assert(button.textContent).equals('?');
                button && assert(button).hasAttributes({
                    'data-action': 'toggle',
                    'data-target': 'info-dungeonComplexity',
                });
            });

            it('contains a hidden info paragraph element', () => {
                const info = body.querySelector('p');

                assert(Boolean(info)).isTrue();
                assert(info.textContent).equals('Pi');
                info && assert(info).hasAttributes({
                    'data-id': 'info-dungeonComplexity',
                    'hidden' : 'true',
                });
            });
        });

        describe('given settings for multiple knobs', () => {
            const body = parseHtml(getFields([
                /** @type {KnobFieldConfig} */ ({ name: 'itemQuantity', label: 'Size',        desc: 'Size?',        type: 'number'                  }),
                /** @type {KnobFieldConfig} */ ({ name: 'itemRarity',   label: 'Shape',       desc: 'Shape?',       type: 'range'                   }),
                /** @type {KnobFieldConfig} */ ({ name: 'itemType',     label: 'Squishiness', desc: 'Squishiness?', type: 'select', values: [ '1' ] }),
            ]));

            it('contains an input for each knob setting', () => {
                assert(Boolean(body.querySelector(`input[name="itemQuantity"]`))).isTrue();
                assert(Boolean(body.querySelector(`input[name="itemRarity"]`))).isTrue();
                assert(Boolean(body.querySelector(`select[name="itemType"]`))).isTrue();
            });

            it('contains a label element for each knob', () => {
                assert(Boolean(body.querySelector(`label[for="knob-itemtype"]`))).isTrue();
                assert(Boolean(body.querySelector(`label[for="knob-itemrarity"]`))).isTrue();
                assert(Boolean(body.querySelector(`label[for="knob-itemtype"]`))).isTrue();
            });
        });
    });

    describe('getKnob()', () => {
        describe('given an invalid type', () => {
            it('throws', () => {
                // @ts-expect-error
                assert(() => getKnob({ ...fakeKnob, type: 'junk' }))
                    .throws('Invalid knob type in getKnob()');
            });
        });

        describe('given a type of "number"', () => {
            const body = parseHtml(getKnob({
                ...fakeKnob,
                type: 'number',
                value: 12,
            }, 'knob-dungeon-babble'));

            const input = /** @type {HTMLInputElement} */ (body.children.item(0));

            it('returns an HTML input element', () => {
                assert(input.tagName).equals('INPUT');
            });

            it('has a type of "number"', () => {
                assert(input).hasAttributes({ type: 'number' });
            });

            it('has the given value', () => {
                assert(input.value).equals('12');
            });

            it('has the given name and id attributes', () => {
                assert(input).hasAttributes({
                    id  : 'knob-dungeon-babble',
                    name: 'dungeonComplexity',
                });
            });
        });

        describe('given a type of "range"', () => {
            const body = parseHtml(getKnob({
                ...fakeKnob,
                max: 216,
                min: 12,
                type: 'range',
                value: 121,
            }, 'knob-dungeon-slider'));

            const input = /** @type {HTMLInputElement} */ (body.children.item(0));

            it('returns an HTML input element', () => {
                assert(input.tagName).equals('INPUT');
            });

            it('has a type of "range"', () => {
                assert(input).hasAttributes({ type: 'range' });
            });

            it('has the given value', () => {
                assert(input.value).equals('121');
            });

            it('has the given name and id attributes', () => {
                assert(input).hasAttributes({
                    id  : 'knob-dungeon-slider',
                    name: 'dungeonComplexity',
                });
            });

            it('has the provided min and max attributes', () => {
                assert(input).hasAttributes({ min: '12', max: '216' });
            });
        });

        describe('given a type of "select"', () => {
            const body = parseHtml(getKnob({
                ...fakeKnob,
                type: 'select',
                value: 'toast',
                values: [ 'toast', 'coffee' ],
            }, 'knob-dungeon-complexity'));

            const select = /** @type {HTMLSelectElement} */ (body.children.item(0));

            it('returns an HTML select element', () => {
                assert(select.tagName).equals('SELECT');
            });

            it('has the given value', () => {
                assert(select.value).equals('toast');
            });

            it('has the given name and id attributes', () => {
                assert(select).hasAttributes({
                    id  : 'knob-dungeon-complexity',
                    name: 'dungeonComplexity',
                });
            });

            it('contains an option for each of the given values', () => {
                const options = body.querySelectorAll('option');

                assert(options.length).equals(2);
                assert(options[0].textContent).equals('toast');
                assert(options[0]).hasAttributes({ 'value': 'toast' });
                assert(options[1].textContent).equals('coffee');
                assert(options[1]).hasAttributes({ 'value': 'coffee' });
            });

            describe('given a value that is not a string', () => {
                it('throws', () => {
                    assert(() => getKnob({ ...fakeKnob, type: 'select', value: 12 }, 'knob-dungeon-complexity'))
                        .throws('Select value must be a string in getKnob()');
                });
            });
        });

        describe('given a type of "text"', () => {
            const body = parseHtml(getKnob({
                ...fakeKnob,
                type: 'text',
                value: 'Bob is a cool dude',
            }, 'knob-dungeon-babble'));

            const input = /** @type {HTMLInputElement} */ (body.children.item(0));

            it('returns an HTML input element', () => {
                assert(input.tagName).equals('INPUT');
            });

            it('has a type of "text"', () => {
                assert(input).hasAttributes({ type: 'text' });
            });

            it('has the given value', () => {
                assert(input.value).equals('Bob is a cool dude');
            });

            it('has the given name and id attributes', () => {
                assert(input).hasAttributes({
                    id  : 'knob-dungeon-babble',
                    name: 'dungeonComplexity',
                });
            });
        });
    });

    // -- Public Functions -----------------------------------------------------

    describe('getFormData()', () => {
        describe('given an element with knob child elements', () => {
            const container = document.createElement('div');

            const addKnob = (tag, name, value) => {
                const knob = document.createElement(tag);

                knob.name  = name;
                knob.value = value;

                if (tag === 'select') {
                    knob.innerHTML = `<option value="${value}">${value}</option>`;
                }

                container.appendChild(knob);
            };

            addKnob('input', 'dungeonComplexity', 'ralph');
            addKnob('select', 'itemType', 'bob');
            addKnob('input', 'roomCount', 12);

            const results = getFormData(container);

            it('returns an object', () => {
                assert(results).isObject();
            });

            it('returns an object of knob values keyed by knob name', () => {
                assert(results.dungeonComplexity).equals('ralph');
                assert(results.itemType).equals('bob');
                assert(results.roomCount).equals('12');
            });
        });
    });

    // TODO tests for `config` & `isExpanded` options, expand/collapse button
    describe('getKnobPanel()', () => {
        let body = parseHtml(getKnobPanel('dungeon'));

        it('returns valid HTML', () => {
            assert(Boolean(body)).isTrue();
        });

        it('contains a submit button', () => {
            const button = body.querySelector('button[type="submit"]');

            assert(Boolean(button)).isTrue();
            button && assert(button.textContent).equals('Generate');
            button && assert(button).hasAttributes({
                'data-action': 'generate',
            });
        });

        it('contains three fieldsets for the dungeon panel', () => {
            assert(body.querySelectorAll('fieldset').length).equals(3);
        });

        describe('given a generator of "items"', () => {
            it('contains one fieldset for the items generator', () => {
                const fieldsets = parseHtml(getKnobPanel('items')).querySelectorAll('fieldset');
                assert(fieldsets.length).equals(1);
            });
        });
    });
};
