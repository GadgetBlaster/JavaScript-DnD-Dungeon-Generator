
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

/**
 * @param {import('../../unit/state.js').Utility}
 */
export default ({ assert, describe, it }) => {

    // -- Private Functions ----------------------------------------------------

    describe('getKnob()', () => {
        describe('given an invalid type', () => {
            it('should throw', () => {
                assert(() => getKnob({ name: 'Tools' }))
                    .throws('Invalid knob type');
            });
        });

        describe('given a type of `typeSelect`', () => {
            it('should return an html select element string', () => {
                assert(getKnob({ type: typeSelect, values: [] })).isElementTag('select');
            });
        });

        describe('given a type of `typeNumber`', () => {
            it('should return an html input element string', () => {
                assert(getKnob({ type: typeNumber })).isElementTag('input');
            });
        });

        describe('given a type of `typeRange`', () => {
            it('should return an html input element string', () => {
                assert(getKnob({ type: typeRange })).isElementTag('input');
            });
        });
    });

    describe('renderFields()', () => {
        describe('given an empty array', () => {
            it('should return an empty string', () => {
                assert(renderFields([])).equals('');
            });
        });

        describe('given no name', () => {
            it('should throw', () => {
                assert(() => renderFields([ { label: 'Pirates' } ]))
                    .throws('Missing required knob name');
            });
        });

        describe('given no label', () => {
            it('should throw', () => {
                assert(() => renderFields([ { name: 'Pirates' } ]))
                    .throws('Missing required knob label');
            });
        });

        const numberSettings = { name: 'size', label: 'Size', type: typeNumber };

        describe('given settings for a single knob', () => {
            describe('given a name, label, and type', () => {
                const result = renderFields([ numberSettings ]);

                it('should return a string', () => {
                    assert(result).isString();
                });

                it('should include an html input string', () => {
                    assert(result).stringIncludes('<input name="size" type="number" />');
                });

                it('should include an html label string', () => {
                    assert(result).stringIncludes('<label>Size</label>');
                });
            });

            describe('given no description', () => {
                const result = renderFields([ numberSettings ]);

                it('should not include an html info button string', () => {
                    assert(result).stringExcludes('<button');
                });

                it('should not include an html info paragraph string', () => {
                    assert(result).stringExcludes('<p');
                });
            });

            describe('given a description', () => {
                const result = renderFields([ { ...numberSettings, desc: 'Toad\'s tenacity'} ]);

                it('should include an html info button string', () => {
                    const snapshot = '<button data-action="showHide" data-size="auto" data-target="info-size" data-info="true" type="button">?</button>';
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
                { name: 'size', label: 'Size', type: typeNumber },
                { name: 'shape', label: 'Shape', type: typeRange },
                { name: 'squishiness', label: 'Squishiness', type: typeSelect, values: [] },
            ]);

            it('should include an html input string for each knob setting', () => {
                assert(result)
                    .stringIncludes('<input name="size" type="number" />')
                    .stringIncludes('<input name="shape" type="range" />')
                    .stringIncludes('<select name="squishiness"></select>');
            });

            it('should include an html label string for each knob setting', () => {
                assert(result)
                    .stringIncludes('<label>Size</label')
                    .stringIncludes('<label>Shape</label')
                    .stringIncludes('<label>Squishiness</label');
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
                const snapshot = '<button data-action="accordion" data-size="small" data-target="fieldset-shovels" type="button">Shovels</button>';
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
                { name: 'size', label: 'Size', type: typeNumber },
                { name: 'shape', label: 'Shape', type: typeRange },
                { name: 'squishiness', label: 'Squishiness', type: typeSelect, values: [] },
            ];

            const result = renderKnobs([ { label: 'Shovels', fields } ]);

            it('should include an html input string for each knob setting', () => {
                assert(result)
                    .stringIncludes('<input name="size" type="number" />')
                    .stringIncludes('<input name="shape" type="range" />')
                    .stringIncludes('<select name="squishiness"></select>');
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
