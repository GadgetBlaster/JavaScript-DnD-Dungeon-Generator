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
            const body = parseHtml(func('Gandalf', {
                'aria-label' : 'Watch out!',
                'data-action': 'fireball',
            }));

            const element = body.children.item(0);

            it('returns an single element', () => {
                assert(body.children.length).equals(1);
            });

            it(`returns an html ${tag} element`, () => {
                assert(element.tagName).equals(tag.toUpperCase());
            });

            it('contains the given label', () => {
                assert(element.textContent).equals('Gandalf');
            });

            it('has the given attributes', () => {
                assert(element).hasAttributes({
                    'aria-label' : 'Watch out!',
                    'data-action': 'fireball',
                });
            });
        });
    });

};
