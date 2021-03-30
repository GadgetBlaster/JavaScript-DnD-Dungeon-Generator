
import {
    attachActions,
    toggleAccordion,
    toggleVisibility,
    actions,
} from '../action.js';

/**
 * @param {import('../../unit/state.js').Utility}
 */
export default ({ assert, describe, it }) => {
    describe('attachActions()', () => {
        describe('given a container element and an `actions` object', () => {
            describe('when a child element is clicked', () => {
                describe('when the child has a `data-action` attribute', () => {
                    describe('when the `data-action` attribute is a key in the `actions` object', () => {
                        const container = document.createElement('div');
                        const button    = document.createElement('button');

                        button.dataset.action = actions.home;

                        container.appendChild(button);

                        let event;

                        const triggers = {
                            [actions.home]: (e) => {
                                event = e;
                            },
                        };

                        attachActions(container, triggers);

                        button.dispatchEvent(new MouseEvent('click', { bubbles: true }));

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

    describe('toggleAccordion()', () => {
        describe('given a container', () => {
            describe('when there are 3 child accordion elements', () => {
                const count     = 3;
                const container = document.createElement('div');

                for (let i = 0; i < count; i++) {
                    const fieldset = document.createElement('div');
                    fieldset.dataset.collapsed = true;
                    fieldset.dataset.id = i;

                    const button = document.createElement('button');
                    button.dataset.target = i;

                    fieldset.appendChild(button);
                    container.appendChild(fieldset);
                }

                const each = ({ collapsed }) => {
                    container.querySelectorAll('[data-collapsed]').forEach((item) => {
                        item.dataset.collapsed = collapsed;
                    });
                };

                const collapseAll = () => each({ collapsed: true });
                const expandAll   = () => each({ collapsed: false });

                describe('given an event with a target', () => {
                    const target = 1;
                    const event  = { target: { dataset: { target } } };

                    describe('when the accordion item is collapsed', () => {
                        collapseAll();
                        toggleAccordion(container, event);

                        it('should expand that accordion item', () => {
                            let item = container.querySelector(`[data-collapsed][data-id="${target}"]`);
                            assert(item.dataset.collapsed).equals('false');
                        });
                    });

                    describe('when the accordion item is expanded', () => {
                        expandAll();
                        toggleAccordion(container, event);

                        it('should collapse that accordion item', () => {
                            let item = container.querySelector(`[data-collapsed][data-id="${target}"]`);
                            assert(item.dataset.collapsed).equals('true');
                        });
                    });

                    describe('when other accordion items are expanded', () => {
                        expandAll();
                        toggleAccordion(container, event);

                        it('should collapse all accordion items', () => {
                            container.querySelectorAll('[data-collapsed]').forEach((item) => {
                                assert(item.dataset.collapsed).equals('true');
                            });
                        });
                    });
                });
            });
        });
    });

    describe('toggleVisibility()', () => {
        describe('given a container', () => {
            describe('when there is a child element', () => {
                const target    = 'elf';
                const container = document.createElement('div');

                const paragraph = document.createElement('p');
                paragraph.dataset.id = target;
                paragraph.hidden = false;

                container.appendChild(paragraph);

                describe('given an event with a target', () => {
                    const event  = { target: { dataset: { target } } };

                    describe('when the child is not hidden', () => {
                        paragraph.hidden = false;

                        it('should hide the element', () => {
                            toggleVisibility(container, event);
                            assert(paragraph.hidden).isTrue();
                        });
                    });

                    describe('when the child is hidden', () => {
                        paragraph.hidden = true;

                        it('should hide the element', () => {
                            toggleVisibility(container, event);
                            assert(paragraph.hidden).isFalse();
                        });
                    });
                });
            });
        });
    });
};
