// @ts-check

import {
    // Private Functions
    testGetKnob as getKnob,
    testRenderFields as renderFields,

    // Public Functions
    getFormData,
    renderKnobs,
    submitButton,
} from '../form.js';

import { actions } from '../action.js';
import { typeSelect, typeNumber, typeRange } from '../../knobs.js';

const fakeKnob = {
    label: 'Tools',
    name: 'dungeonComplexity',
    desc: 'How complex should it be?',
    type: typeRange,
};

/**
 * @param {import('../../unit/state.js').Utility} utility
 */
export default ({ assert, describe, it }) => {

    // -- Private Functions ----------------------------------------------------

    describe('getKnob()', () => {
        describe('given an invalid type', () => {
            it('should throw', () => {
                assert(() => getKnob({ ...fakeKnob, type: 'junk' }))
                    .throws('Invalid knob type');
            });
        });

        describe('given a type of `typeSelect`', () => {
            it('should return an html select element string with the given values as options', () => {
                const knob = getKnob({ ...fakeKnob, type: typeSelect, values: [ 'toast' ] });
                assert(/<select(.*?)><option(.+?)value="toast"(.*?)>toast<\/option><\/select>/.test(knob)).isTrue();
            });
        });

        describe('given a type of `typeNumber`', () => {
            it('should return an html input element string', () => {
                assert(getKnob({ ...fakeKnob, type: typeNumber })).isElementTag('input');
            });
        });

        describe('given a type of `typeRange`', () => {
            it('should return an html input element string', () => {
                assert(getKnob({ ...fakeKnob, type: typeRange })).isElementTag('input');
            });
        });
    });

    describe('renderFields()', () => {
        describe('given an empty array', () => {
            it('should return an empty string', () => {
                assert(renderFields([])).equals('');
            });
        });

        describe('given a knob with no name', () => {
            it('should throw', () => {
                const knob = { ...fakeKnob };
                delete knob.name;

                assert(() => renderFields([ knob ]))
                    .throws('Missing required knob name');
            });
        });

        describe('given a knob with no label', () => {
            it('should throw', () => {
                const knob = { ...fakeKnob };
                delete knob.label;

                assert(() => renderFields([ knob ]))
                    .throws('Missing required knob label');
            });
        });

        describe('given a knob with no description', () => {
            it('should throw', () => {
                const knob = { ...fakeKnob };
                delete knob.desc;

                assert(() => renderFields([ knob ]))
                    .throws('Missing required knob description');
            });
        });


        describe('given settings for a single knob', () => {
            const knob = { name: 'size', label: 'Size', desc: 'Pi', type: typeNumber };

            describe('given a name, label, and type', () => {
                const result = renderFields([ knob ]);

                it('should return a string', () => {
                    assert(result).isString();
                });

                it('should include an html input string', () => {
                    assert(result).stringIncludes('<input name="size" type="number" />');
                });

                it('should include an html label string', () => {
                    assert(/<label>Size(.*?)<\/label>/.test(result)).isTrue();
                });
            });

            describe('given a description', () => {
                const result = renderFields([ { ...knob, desc: 'Toad\'s tenacity'} ]);

                it('should include an html info button string', () => {
                    const snapshot = '<button data-action="showHide" data-size="auto" data-target="info-size" ' +
                        'data-info="true" type="button">?</button>';

                    assert(result).stringIncludes(snapshot);
                });

                it('should include an hidden html info paragraph string', () => {
                    const snapshot = '<p hidden="true" data-id="info-size"><small>Toad\'s tenacity</small></p>';
                    assert(result).stringIncludes(snapshot);
                });
            });
        });

        describe('given settings for multiple knobs', () => {
            const result = renderFields([
                { name: 'size',        label: 'Size',        desc: 'Size?',        type: typeNumber             },
                { name: 'shape',       label: 'Shape',       desc: 'Shape?',       type: typeRange              },
                { name: 'squishiness', label: 'Squishiness', desc: 'Squishiness?', type: typeSelect, values: [ '1' ] },
            ]);

            it('should include an html input string for each knob setting', () => {
                assert(result)
                    .stringIncludes('<input name="size" type="number" />')
                    .stringIncludes('<input name="shape" type="range" />')
                    .stringIncludes('<select name="squishiness"><option value="1">1</option></select>');
            });

            it('should include an HTML label string for each knob setting', () => {
                assert(/<label>Size(.*?)<\/label>/.test(result)).isTrue();
                assert(/<label>Shape(.*?)<\/label>/.test(result)).isTrue();
                assert(/<label>Squishiness(.*?)<\/label>/.test(result)).isTrue();
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

            addKnob('input', 'gopher', 'ralph');
            addKnob('select', 'lion', 'bob');
            addKnob('input', 'hats', 12);

            const results = getFormData(container);

            it('should return an object', () => {
                assert(results).isObject();
            });

            it('should return an object of knob values keyed by knob name', () => {
                assert(results.gopher).equals('ralph');
                assert(results.lion).equals('bob');
                assert(results.hats).equals('12');
            });
        });
    });

    describe('renderKnobs()', () => {
        describe('given an empty array', () => {
            it('should return an empty string', () => {
                assert(renderKnobs([])).equals('');
            });
        });

        describe('given a knob config', () => {
            const result = renderKnobs([ { label: 'Shovels', fields: [] } ]);

            it('should return an html fieldset element string', () => {
                assert(result)
                    .stringIncludes('<fieldset')
                    .stringIncludes('</fieldset>');
            });

            it('should contain the correct data-id', () => {
                assert(result).stringIncludes('data-id="fieldset-shovels"');
            });

            it('should be collapsed by default', () => {
                assert(result).stringIncludes('data-collapsed="true"');
            });

            it('should include an html accordion button', () => {
                const snapshot = '<button data-action="accordion" data-size="small" data-target="fieldset-shovels" ' +
                    'type="button">Shovels</button>';

                assert(result).stringIncludes(snapshot);
            });
        });

        describe('given a labels setting', () => {
            const labels = { farm: 'Superior digging tools', mine: 'Funky mining tools' };
            const config = { label: 'Shovels', labels, fields: [] };

            describe('given no page param', () => {
                const result = renderKnobs([ config ]);

                it('should render the default label', () => {
                    assert(result)
                        .stringIncludes('Shovels')
                        .stringExcludes('tools');
                });
            });

            describe('given a page param', () => {
                const result = renderKnobs([ config ], 'farm');

                it('should render the correct label', () => {
                    assert(result)
                        .stringIncludes('Superior digging tools')
                        .stringExcludes('Shovels');
                });
            });
        });

        describe('given an array of fields', () => {
            const fields = [
                { name: 'size',        label: 'Size',        desc: 'Size?',        type: typeNumber             },
                { name: 'shape',       label: 'Shape',       desc: 'Shape?',       type: typeRange              },
                { name: 'squishiness', label: 'Squishiness', desc: 'Squishiness?', type: typeSelect, values: [ '1' ] },
            ];

            const result = renderKnobs([ { label: 'Shovels', fields } ]);

            it('should include an HTML input string for each knob setting', () => {
                assert(result)
                    .stringIncludes('<input name="size" type="number" />')
                    .stringIncludes('<input name="shape" type="range" />')
                    .stringIncludes('<select name="squishiness"><option value="1">1</option></select>');
            });
        });
    });

    describe('submitButton()', () => {
        it('should be a string', () => {
            assert(submitButton).isString();
        });

        it('should be an html button element string', () => {
            assert(submitButton).isElementTag('button');
        });

        it('should have a `type="submit"` attribute', () => {
            assert(submitButton).stringIncludes('type="submit"');
        });

        it(`should have a \`data-action="${actions.generate}"\` attribute`, () => {
            assert(submitButton).stringIncludes(`data-action="${actions.generate}"`);
        });
    });
};
