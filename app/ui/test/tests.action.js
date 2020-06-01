
import {
    attachActions,
} from '../action.js';

/**
 * @param {import('../../../unit/unit.js').Utility}
 */
export default ({ assert, describe, it }) => {
    describe('#attachActions', () => {
        describe('given a container element and an `actions` object', () => {
            describe('when a child element is clicked', () => {
                const container = document.createElement('div');
                const button   = document.createElement('button');

                button.dataset.action = 'superFly';

                container.appendChild(button);

                let event;

                const actions = {
                    superFly: (e) => {
                        event = e;
                    },
                };

                attachActions(container, actions);

                button.dispatchEvent(new MouseEvent('click', { bubbles: true }));

                describe('when the child has a `data-action` attribute', () => {
                    describe('when the `data-action` attribute is a key in the `actions` object', () => {
                        it('should trigger the click delegate and call the action', () => {
                            assert(Boolean(event)).isTrue();
                        });

                        it('should call the action with a click event object param', () => {
                            assert(event).isObject();
                            assert(event.type).equals('click');
                        });
                    });
                });
            });
        });
    });

    describe('#toggleAccordion', () => {

    });
};
