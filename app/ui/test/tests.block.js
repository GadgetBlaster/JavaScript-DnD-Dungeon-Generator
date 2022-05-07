// @ts-check

import { parseHtml } from '../../utility/element.js';
import {
    article,
    div,
    fieldset,
    header,
    section,
} from '../block.js';

const blocks = {
    article,
    div,
    fieldset,
    header,
    section,
};

/**
 * @param {import('../../unit/state.js').Utility} utility
 */
export default ({ assert, describe, it }) => {

    // -- Public Functions -----------------------------------------------------

    Object.entries(blocks).forEach(([ tag, func ]) => {
        describe(`${tag}()`, () => {
            const result  = func('Gandalf', { 'data-action': 'fireball', 'aria-label': 'Watch out!' });
            const element = parseHtml(result).querySelector(tag);

            it(`contains an HTML ${tag} element`, () => {
                assert(Boolean(element)).isTrue();
            });

            it('contains the given label', () => {
                assert(element.textContent).equals('Gandalf');
            });

            it('has the given attributes', () => {
                assert(element).hasAttributes({ 'data-action': 'fireball', 'aria-label': 'Watch out!' });
            });
        });
    });

};
