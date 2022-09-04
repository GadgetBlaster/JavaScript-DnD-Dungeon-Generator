// @ts-check

import { parseHtml } from '../../utility/element.js';
import { spinner } from '../spinner.js';

/**
 * @param {import('../../unit/state.js').Utility} utility
 */
export default ({ assert, describe, it }) => {

    // -- Public Functions -----------------------------------------------------

    describe('spinner()', () => {
        const body    = parseHtml(spinner());
        const element = body.children.item(0);

        it('returns an single element', () => {
            assert(body.children.length).equals(1);
        });

        it('returns an HTML div element with the data-spinner attribute', () => {
            assert(element).isElementTag('div');
            assert(element).hasAttributes({ 'data-spinner': '' });
        });

        it('contains the default label', () => {
            assert(element).hasTextContent('Mumbling incantations...');
        });

        describe('given a custom label href', () => {
            it('contains the custom label', () => {
                const customSpinner = parseHtml(spinner('Hang tight...')).children.item(0);
                assert(customSpinner).hasTextContent('Hang tight...');
            });
        });
    });

};
