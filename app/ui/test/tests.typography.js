// @ts-check

import { parseHtml } from '../../utility/element.js';
import {
    em,
    paragraph,
    small,
    span,
    strong,
    subtitle,
    title,
} from '../typography.js';

/** @typedef {import('../../utility/element').Attributes} Attributes */

const type = {
    'em'    : em,
    'h2'    : title,
    'h3'    : subtitle,
    'p'     : paragraph,
    'small' : small,
    'span'  : span,
    'strong': strong,
};

/**
 * @param {import('../../unit/state.js').Utility} utility
 */
export default ({ assert, describe, it }) => {

    // -- Public Functions -----------------------------------------------------

    Object.entries(type).forEach(([ tag, func ]) => {
        describe(`${tag}()`, () => {
            const result  = func('Gandalf', { 'data-action': 'fireball', 'aria-label': 'Watch out!' });
            const element = parseHtml(result).querySelector(tag);

            it('returns an html element string with the correct the tag name', () => {
                assert(result).isElementTag(tag);
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
