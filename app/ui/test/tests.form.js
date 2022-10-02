// @ts-check

import {
    // Private Functions
    testFormatKnobAccordions as formatKnobAccordions,
    testGetFields            as getFields,
    testGetKnob              as getKnob,
    testGetKnobIds           as getKnobIds,

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
            const result = formatKnobAccordions([
                {
                    fields    : [],
                    generator : 'items',
                    generators: new Set([ 'items' ]),
                    label     : 'Shovels And Spades',
                }
            ]);

            const fieldset = parseHtml(result).querySelector('fieldset');

            it('contains an HTML fieldset element', () => {
                assert(Boolean(fieldset)).isTrue();
            });

            it('has the correct data-id', () => {
                assert(fieldset).hasAttributes({ 'data-id': 'fieldset-shovels-and-spades' });
            });

            it('contains an accordion button associated to the fieldset', () => {
                const accordion = fieldset && fieldset.querySelector('button[data-action="accordion"]');

                assert(Boolean(accordion)).isTrue();
                assert(accordion)
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

            const body = parseHtml(formatKnobAccordions([
                {
                    fields,
                    generator : 'items',
                    generators: new Set([ 'items' ]),
                    label     : 'Shovels',
                },
            ]));

            it('contains input and label elements for each knob', () => {
                fields.forEach(({ name, label }) => {
                    const knob = body.querySelector(`[name="${name}"]`);

                    assert(Boolean(knob)).isTrue();
                    knob && assert(body.querySelector(`label[for="${knob.id}"]`))
                        .hasTextContent(label);
                });
            });
        });

        describe('given multiple knob configs', () => {
            it('collapses all sections except the first', () => {
                const body = parseHtml(formatKnobAccordions([
                    { label: 'Shovels',         fields: [], generator: 'items', generators: new Set() },
                    { label: 'Gardening Tools', fields: [], generator: 'items', generators: new Set() },
                    { label: 'Weed Whackers',   fields: [], generator: 'items', generators: new Set() },
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
        describe('given no generator name', () => {
            it('throws', () => {
                // @ts-expect-error
                assert(() => getFields([ fakeKnob ]))
                    .throws('generator is required in getFields()');
            });
        });

        describe('given an empty array', () => {
            it('returns an empty string', () => {
                assert(getFields([], 'maps')).equals('');
            });
        });

        describe('given a knob with no name', () => {
            it('throws', () => {
                const knob = { ...fakeKnob };

                // @ts-expect-error
                delete knob.name;

                assert(() => getFields([ knob ], 'maps'))
                    .throws('knob name is required in getFields()');
            });
        });

        describe('given a knob with no label', () => {
            it('throws', () => {
                const knob = { ...fakeKnob };

                // @ts-expect-error
                delete knob.label;

                assert(() => getFields([ knob ], 'maps'))
                    .throws('knob label is required in getFields()');
            });
        });

        describe('given a knob with no description', () => {
            it('throws', () => {
                const knob = { ...fakeKnob };

                // @ts-expect-error
                delete knob.desc;

                assert(() => getFields([ knob ], 'maps'))
                    .throws('knob description is required in getFields()');
            });
        });

        describe('given a config for a single knob', () => {
            /** @type {KnobFieldConfig} */
            const knobConfig = { name: 'dungeonComplexity', label: 'Complexity', desc: 'Pi', type: 'range' };

            const body   = parseHtml(getFields([ knobConfig ], 'maps'));
            const input  = body.querySelector('input');

            it('contains an input element with the correct name', () => {
                assert(Boolean(input)).isTrue();
                assert(input).hasAttributes({ name: 'dungeonComplexity' });
            });

            it('contains a html label element associated to an input', () => {
                const label = body.querySelector('label');

                assert(Boolean(label)).isTrue();
                assert(label).hasTextContent('Complexity');
                input && assert(label).hasAttributes({ for: input.id });
            });

            it('contains an info button element with the correct target', () => {
                const button = body.querySelector('button');

                assert(Boolean(button)).isTrue();
                assert(button).hasTextContent('?');
                assert(button).hasAttributes({
                    'data-action': 'toggle',
                    'data-target': 'info-dungeon-complexity',
                });
            });

            it('contains a hidden info paragraph element', () => {
                const info = body.querySelector('[id="info-dungeon-complexity"]');

                assert(Boolean(info)).isTrue();
                assert(info).isElementTag('p');
                assert(info).hasTextContent('Pi');
                assert(info).hasAttributes({
                    'hidden': 'true',
                    id      : 'info-dungeon-complexity',
                });
            });

            it('contains a hidden error paragraph element', () => {
                const error = body.querySelector('p[id="error-dungeon-complexity"]');

                assert(Boolean(error)).isTrue();
                assert(error).isElementTag('p');
                assert(error).hasTextContent('');
                assert(error).hasAttributes({
                    'data-error': '',
                    'hidden'    : 'true',
                    id          : 'error-dungeon-complexity',
                });
            });
        });

        describe('given settings for multiple knobs', () => {
            const body = parseHtml(getFields([
                /** @type {KnobFieldConfig} */ ({ name: 'itemQuantity', label: 'Size',        desc: 'Size?',        type: 'number'                  }),
                /** @type {KnobFieldConfig} */ ({ name: 'itemRarity',   label: 'Shape',       desc: 'Shape?',       type: 'range'                   }),
                /** @type {KnobFieldConfig} */ ({ name: 'itemType',     label: 'Squishiness', desc: 'Squishiness?', type: 'select', values: [ '1' ] }),
            ], 'items'));

            it('contains an input for each knob setting', () => {
                assert(Boolean(body.querySelector(`input[name="itemQuantity"]`))).isTrue();
                assert(Boolean(body.querySelector(`input[name="itemRarity"]`))).isTrue();
                assert(Boolean(body.querySelector(`select[name="itemType"]`))).isTrue();
            });

            it('contains a label element for each knob', () => {
                assert(Boolean(body.querySelector(`label[for="knob-item-type"]`))).isTrue();
                assert(Boolean(body.querySelector(`label[for="knob-item-rarity"]`))).isTrue();
                assert(Boolean(body.querySelector(`label[for="knob-item-type"]`))).isTrue();
            });
        });
    });

    describe('getKnob()', () => {
        describe('given an invalid type', () => {
            it('throws', () => {
                const ids = { infoId: '1', errorId: '2', knobId: '3' };

                // @ts-expect-error
                assert(() => getKnob({ ...fakeKnob, type: 'junk' }, ids))
                    .throws('Invalid knob type in getKnob()');
            });
        });

        const ids = {
            errorId    : 'error-dungeonBabble',
            generatorId: 'maps',
            infoId     : 'info-dungeonBabble',
            knobId     : 'knob-dungeon-babble',
        };

        describe('given a type of "number"', () => {
            const body = parseHtml(getKnob({
                ...fakeKnob,
                max: 25,
                min: 0,
                type: 'number',
                value: 12,
            }, ids));

            const input = /** @type {HTMLInputElement} */ (body.children.item(0));

            it('returns an HTML input element', () => {
                assert(input).isElementTag('input');
            });

            it('has a type of "number"', () => {
                assert(input).hasAttributes({ type: 'number' });
            });

            it('has the given value', () => {
                assert(input.value).equals('12');
            });

            it('has correct attributes', () => {
                assert(input).hasAttributes({
                    'aria-describedby': `${ids.infoId} ${ids.errorId}`,
                    'data-error-id'   : ids.errorId,
                    id                : 'knob-dungeon-babble',
                    name              : 'dungeonComplexity',
                });
            });

            it('has the provided min and max attributes', () => {
                assert(input).hasAttributes({ min: '0', max: '25' });
            });
        });

        describe('given a type of "range"', () => {
            const body = parseHtml(getKnob({
                ...fakeKnob,
                max: 216,
                min: 12,
                type: 'range',
                value: 121,
            }, ids));

            const input = /** @type {HTMLInputElement} */ (body.children.item(0));

            it('returns an HTML input element', () => {
                assert(input).isElementTag('input');
            });

            it('has a type of "range"', () => {
                assert(input).hasAttributes({ type: 'range' });
            });

            it('has the given value', () => {
                assert(input.value).equals('121');
            });

            it('has correct attributes', () => {
                assert(input).hasAttributes({
                    'aria-describedby': `${ids.infoId} ${ids.errorId}`,
                    'data-error-id'   : ids.errorId,
                    id                : 'knob-dungeon-babble',
                    name              : 'dungeonComplexity',
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
            }, ids));

            const select = /** @type {HTMLSelectElement} */ (body.children.item(0));

            it('returns an HTML select element', () => {
                assert(select).isElementTag('select');
            });

            it('has the given value', () => {
                assert(select.value).equals('toast');
            });

            it('has correct attributes', () => {
                assert(select).hasAttributes({
                    'aria-describedby': `${ids.infoId} ${ids.errorId}`,
                    'data-error-id'   : ids.errorId,
                    id                : 'knob-dungeon-babble',
                    name              : 'dungeonComplexity',
                });
            });

            it('contains an option for each of the given values', () => {
                const options = body.querySelectorAll('option');

                assert(options.length).equals(2);
                assert(options[0]).hasTextContent('toast');
                assert(options[0]).hasAttributes({ 'value': 'toast' });
                assert(options[1]).hasTextContent('coffee');
                assert(options[1]).hasAttributes({ 'value': 'coffee' });
            });

            describe('given a value that is not a string', () => {
                it('throws', () => {
                    assert(() => getKnob({ ...fakeKnob, type: 'select', value: 12 }, ids))
                        .throws('Select value must be a string in getKnob()');
                });
            });

            describe('given no values', () => {
                it('throws', () => {
                    assert(() => getKnob({ ...fakeKnob, type: 'select' }, ids))
                        .throws('Select values must be an array of strings in getKnob()');
                });
            });

            describe('when values is not an array', () => {
                it('throws', () => {
                    // @ts-expect-error
                    assert(() => getKnob({ ...fakeKnob, type: 'select', values: 'abc' }, ids))
                        .throws('Select values must be an array of strings in getKnob()');
                });
            });
        });

        describe('given a type of "text"', () => {
            const body = parseHtml(getKnob({
                ...fakeKnob,
                type: 'text',
                value: 'Bob is a cool dude',
            }, ids));

            const input = /** @type {HTMLInputElement} */ (body.children.item(0));

            it('returns an HTML input element', () => {
                assert(input).isElementTag('input');
            });

            it('has a type of "text"', () => {
                assert(input).hasAttributes({ type: 'text' });
            });

            it('has the given value', () => {
                assert(input.value).equals('Bob is a cool dude');
            });

            it('has correct attributes', () => {
                assert(input).hasAttributes({
                    'aria-describedby': `${ids.infoId} ${ids.errorId}`,
                    'data-error-id'   : ids.errorId,
                    id                : 'knob-dungeon-babble',
                    name              : 'dungeonComplexity',
                });
            });
        });
    });

    describe('getKnobIds()', () => {
        it('returns description, error, and knob ids for the given control name', () => {
            assert(getKnobIds('widgetSwitch')).equalsObject({
                errorId: 'error-widget-switch',
                infoId : 'info-widget-switch',
                knobId : 'knob-widget-switch',
            });
        });
    });

    // -- Public Functions -----------------------------------------------------

    describe('getFormData()', () => {
        describe('given an element with knob child elements', () => {
            const container = document.createElement('div');

            const addKnob = ({ tag, name, value, generator }) => {
                const knob = document.createElement(tag);

                knob.name  = name;
                knob.value = value;

                knob.dataset.generator = generator;

                if (tag === 'select') {
                    knob.innerHTML = `<option value="${value}">${value}</option>`;
                }

                container.appendChild(knob);
            };

            addKnob({
                generator: 'maps',
                name     : 'dungeonComplexity',
                tag      : 'input',
                value    : 'ralph',
            });

            addKnob({
                generator: 'items',
                name     :'itemType',
                tag      : 'select',
                value    : 'bob',
            });

            addKnob({
                generator: 'rooms',
                name     : 'roomCount',
                tag      : 'input',
                value    : 12,
            });

            const results = getFormData(container);

            it('returns an object', () => {
                assert(results).isObject();
            });

            it('returns an object of knob values keyed by knob name', () => {
                assert(results?.maps?.dungeonComplexity).equals('ralph');
                assert(results?.items?.itemType).equals('bob');
                assert(results?.rooms?.roomCount).equals('12');
            });
        });
    });

    // TODO tests for `config` & `isExpanded` options, expand/collapse button
    describe('getKnobPanel()', () => {
        let body = parseHtml(getKnobPanel('maps'));

        it('returns valid HTML', () => {
            assert(Boolean(body)).isTrue();
        });

        it('contains a submit button', () => {
            const button = body.querySelector('button[type="submit"]');

            assert(Boolean(button)).isTrue();
            button && assert(button).hasTextContent('Generate');
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
