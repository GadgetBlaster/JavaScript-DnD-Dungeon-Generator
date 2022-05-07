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
            const body = parseHtml(func('Expert Keyboardist', {
                'aria-label' : 'Type type type',
                'data-action': 'More typing',
            }));

            const element = body.children.item(0);

            it('returns an single element', () => {
                assert(body.children.length).equals(1);
            });

            it(`returns an HTML ${tag} element`, () => {
                assert(element.tagName).equals(tag.toUpperCase());
            });

            it('contains the given label', () => {
                assert(element.textContent).equals('Expert Keyboardist');
            });

            it('has the given attributes', () => {
                assert(element).hasAttributes({
                    'aria-label' : 'Type type type',
                    'data-action': 'More typing',
                });
            });
        });
    });

};
