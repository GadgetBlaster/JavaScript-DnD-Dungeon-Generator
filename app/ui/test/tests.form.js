
import { submitButton, _getKnob, _renderFields } from '../form.js';
import { actions } from '../action.js';
import { typeSelect, typeNumber, typeRange } from '../../knobs.js';

/**
 * @param {import('../../../unit/unit.js').Utility}
 */
export default ({ assert, describe, it }) => {
    describe('#submitButton', () => {
        const button = submitButton;

        it('should be a string', () => {
            assert(button).isString();
        });

        it('should be an html button string', () => {
            assert(button).isHtmlTag('button');
        });

        it('should have a `type="submit"` attribute', () => {
            assert(button).stringIncludes('type="submit"');
        });

        it(`should have a \`data-action="${actions.generate}"\` attribute`, () => {
            assert(button).stringIncludes(`data-action="${actions.generate}"`);
        });
    });

    describe('#_getKnob', () => {
        describe('given an invalid type', () => {
            it('should throw', () => {
                assert(() => _getKnob({ name: 'Tools' })).throws();
            });
        });

        describe('given a type of `typeSelect`', () => {
            it('should return an html select string', () => {
                assert(_getKnob({ type: typeSelect, values: [] })).isHtmlTag('select');
            });
        });

        describe('given a type of `typeNumber`', () => {
            it('should return an html input string', () => {
                assert(_getKnob({ type: typeNumber })).isHtmlTag('input');
            });
        });

        describe('given a type of `typeRange`', () => {
            it('should return an html input string', () => {
                assert(_getKnob({ type: typeRange })).isHtmlTag('input');
            });
        });
    });

    describe('#_renderFields', () => {
        describe('given an empty array', () => {
            it('should return an empty string', () => {
                assert(_renderFields([])).equals('');
            });
        });

        describe('given no name', () => {
            it('should throw', () => {
                assert(() => _getKnob({ label: 'Pirates' })).throws();
            });
        });

        describe('given no label', () => {
            it('should throw', () => {
                assert(() => _getKnob({ name: 'Pirates' })).throws();
            });
        });

        const numberSettings = { name: 'size', label: 'Size', type: typeNumber };
        const infoButton     = '<button data-action="showHide" data-size="auto" data-target="info-size" data-info="true" type="button">?</button>';
        const infoParagraph  = '<p hidden="true" data-id="info-size"><small>Toad\'s tenacity</small></p>';

        describe('given settings for a single knob', () => {
            describe('given a name, label, and type', () => {
                const result = _renderFields([ numberSettings ]);

                it('should return a string', () => {
                    assert(result).isString();
                });

                it('should return an html div wrapper', () => {
                    assert(result).isHtmlTag('div');
                });

                it('should include an html input string', () => {
                    assert(result).stringIncludes('<input name="size" type="number" />');
                });

                it('should include an html label string', () => {
                    assert(result).stringIncludes('<label>Size</label>');
                });
            });

            describe('given no description', () => {
                const result = _renderFields([ numberSettings ]);

                it('should not include an html info button string', () => {
                    assert(result).stringExcludes(infoButton);
                });

                it('should not include an html info paragraph string', () => {
                    assert(result).stringExcludes(infoParagraph);
                });
            });

            describe('given a description', () => {
                const result = _renderFields([ { ...numberSettings, desc: 'Toad\'s tenacity'} ]);

                it('should include an html info button string', () => {
                    assert(result).stringIncludes(infoButton);
                });

                it('should include an hidden html info paragraph string', () => {
                    assert(result).stringIncludes(infoParagraph);
                });
            });
        });

        describe('given settings for multiple knobs', () => {
            const result = _renderFields([
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
};
