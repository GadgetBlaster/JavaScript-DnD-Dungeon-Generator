
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
        describe('when a child element is clicked', () => {
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

    describe('toggleAccordion()', () => {
        describe('when there are 3 child accordion elements', () => {
            const count     = 3;
            const container = document.createElement('div');

            for (let i = 0; i < count; i++) {
                const fieldset = document.createElement('div');
                const button   = document.createElement('button');

                fieldset.dataset.collapsed = 'true';
                fieldset.dataset.id = i;

                button.dataset.action = 'accordion';
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

            const targetEl = container.querySelector('[data-action="accordion"][data-target="1"]');
            const event    = { target: targetEl };

            describe('when an accordion section is collapsed', () => {
                it('should expand that accordion item', () => {
                    collapseAll();

                    const section = container.querySelector('[data-collapsed][data-id="1"]');

                    toggleAccordion(container, event);
                    assert(section.dataset.collapsed).equals('false');
                });
            });

            describe('when an accordion section is expanded', () => {
                it('should collapse that accordion item', () => {
                    collapseAll();

                    const section = container.querySelector('[data-collapsed][data-id="1"]');
                    section.dataset.collapsed = 'false';

                    toggleAccordion(container, event);
                    assert(section.dataset.collapsed).equals('true');
                });
            });

            describe('when another accordion section is expanded', () => {
                it('should collapse all accordion items', () => {
                    collapseAll();

                    const section2 = container.querySelector('[data-collapsed][data-id="2"]');
                    section2.dataset.collapsed = 'false';

                    toggleAccordion(container, event);
                    assert(section2.dataset.collapsed).equals('true');
                });
            });
        });
    });

    describe('toggleVisibility()', () => {
        const targetId  = 'elf';
        const container = document.createElement('div');
        const paragraph = document.createElement('p');
        const button    = document.createElement('button');

        paragraph.dataset.id = targetId;
        paragraph.hidden = false;

        button.dataset.target = targetId;

        container.appendChild(paragraph);

        describe('given an event with a target', () => {
            const event = { target: button };

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
};
