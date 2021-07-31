// @ts-check

import {
    // Private Functions
    testGetDataset as getDataset,
    testGetTrigger as getTrigger,

    // Public Functions
    attachActions,
    toggleAccordion,
    toggleVisibility,
    actions,
} from '../action.js';

/**
 * @param {import('../../unit/state.js').Utility} utility
 */
export default ({ assert, describe, it }) => {

    // -- Private Functions ----------------------------------------------------

    describe('getDataset()', () => {
        describe('given an HTML element target', () => {
            it('should return the elements data attributes', () => {
                const div = document.createElement('div');

                div.dataset.type = 'blackKnight';

                assert(getDataset(div)).equalsObject({ type: 'blackKnight' });
            });
        });

        describe('given a target that is not an HTML element', () => {
            it('should return an empty object', () => {
                assert(getDataset(null)).equalsObject({});
            });
        });
    });

    describe('getTrigger()', () => {
        describe('given no action', () => {
            it('returns undefined', () => {
                assert(getTrigger({})).isUndefined();
            });
        });

        describe('given an action that does not exist on the given triggers', () => {
            it('throws', () => {
                assert(() => getTrigger({}, 'bellyFlop')).throws('Invalid action `bellyFlop`');
            });
        });

        describe('given an action that exists on the given triggers', () => {
            it('returns the action', () => {
                const surprise = () => 'success';
                const triggers = { surprise };
                const trigger  = getTrigger(triggers, 'surprise');

                assert(trigger()).equals('success');
            });
        });
    });

    // -- Public Functions -----------------------------------------------------

    describe('attachActions()', () => {
        describe('when a child element is clicked', () => {
            const container = document.createElement('div');
            const button    = document.createElement('button');
            const button2   = document.createElement('button');
            const button3   = document.createElement('button');

            button.dataset.action  = actions.home;
            button3.dataset.action = 'invalid-action';

            container.appendChild(button);
            container.appendChild(button2);
            container.appendChild(button3);

            const events = [];

            const triggers = {
                [actions.home]: (e) => {
                    events.push(e);
                },
            };

            attachActions(container, triggers);

            describe('when the clicked element has a valid `data-action` attribute', () => {
                button.dispatchEvent(new MouseEvent('click', { bubbles: true }));
                const event = events.pop();

                it('should trigger the click delegate and call the action', () => {
                    assert(Boolean(event)).isTrue();
                });

                it('should call the action with a click event object param', () => {
                    assert(event).isObject();
                    assert(event.type).equals('click');
                });
            });

            describe('when the click target has no action', () => {
                it('should not call any actions', () => {
                    button2.dispatchEvent(new MouseEvent('click', { bubbles: true }));
                    assert(events.length).equals(0);
                });
            });
        });
    });

    describe('toggleAccordion()', () => {
        describe('when there are 3 accordion sections', () => {
            const count     = 3;
            const container = document.createElement('div');

            for (let i = 0; i < count; i++) {
                const fieldset = document.createElement('div');
                const button   = document.createElement('button');

                fieldset.dataset.collapsed = 'true';
                fieldset.dataset.id = i.toString();

                button.dataset.action = 'accordion';
                button.dataset.target = i.toString();

                fieldset.appendChild(button);
                container.appendChild(fieldset);
            }

            const each = ({ collapsed }) => {
                /** @type {NodeListOf<HTMLElement>} sectionEls */
                const sectionEls = container.querySelectorAll('[data-collapsed]');

                sectionEls.forEach((sectionEl) => {
                    sectionEl.dataset.collapsed = collapsed;
                });
            };

            const collapseAll = () => each({ collapsed: true });

            const targetEl = container.querySelector('[data-action="accordion"][data-target="1"]');

            const onTargetElClick = (el, callback) => {
                el.addEventListener('click', callback);
                el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
                el.removeEventListener('click', callback);
            };

            describe('when an accordion section is collapsed', () => {
                it('should expand that accordion item', () => {
                    collapseAll();

                    /** @type {HTMLElement} sectionEl */
                    const sectionEl = container.querySelector('[data-collapsed][data-id="1"]');

                    onTargetElClick(targetEl, (e) => {
                        toggleAccordion(container, e);
                        assert(sectionEl.dataset.collapsed).equals('false');
                    });
                });
            });

            describe('when an accordion section is expanded', () => {
                it('should collapse that accordion item', () => {
                    collapseAll();

                    /** @type {HTMLElement} sectionEl */
                    const sectionEl = container.querySelector('[data-collapsed][data-id="1"]');
                    sectionEl.dataset.collapsed = 'false';

                    onTargetElClick(targetEl, (e) => {
                        toggleAccordion(container, e);
                        assert(sectionEl.dataset.collapsed).equals('true');
                    });
                });
            });

            describe('when another accordion section is expanded', () => {
                it('should collapse all accordion items', () => {
                    collapseAll();

                    /** @type {HTMLElement} sectionEle */
                    const sectionEle = container.querySelector('[data-collapsed][data-id="2"]');
                    sectionEle.dataset.collapsed = 'false';

                    onTargetElClick(targetEl, (e) => {
                        toggleAccordion(container, e);
                        assert(sectionEle.dataset.collapsed).equals('true');
                    });
                });
            });

            describe('given an event with no click target' , () => {
                it('should throw', () => {
                    onTargetElClick(document.createElement('button'), (e) => {
                        assert(() => toggleAccordion(container, e)).throws('Missing target for accordion toggle');
                    });
                });
            });

            describe('given an event with an invalid accordion section target' , () => {
                it('should throw', () => {
                    const button = document.createElement('button');

                    button.dataset.action = 'accordion';
                    button.dataset.target = 'nope';

                    onTargetElClick(button, (e) => {
                        assert(() => toggleAccordion(container, e))
                            .throws('Invalid accordion section target `nope`');
                    });
                });
            });
        });
    });

    describe('toggleVisibility()', () => {
        const targetId  = 'elf';
        const container = document.createElement('div');
        const paragraph = document.createElement('p');

        paragraph.dataset.id = targetId;
        paragraph.hidden     = false;

        container.appendChild(paragraph);

        const onTargetElClick = (el, callback) => {
            el.addEventListener('click', callback);
            el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
            el.removeEventListener('click', callback);
        };

        describe('given an event with a valid target', () => {
            const button = document.createElement('button');

            button.dataset.target = targetId;

            describe('when the child is not hidden', () => {
                it('should hide the element', () => {
                    paragraph.hidden = false;

                    onTargetElClick(button, (e) => {
                        toggleVisibility(container, e);
                        assert(paragraph.hidden).isTrue();
                    });
                });
            });

            describe('when the child is hidden', () => {
                it('should hide the element', () => {
                    paragraph.hidden = true;

                    onTargetElClick(button, (e) => {
                        toggleVisibility(container, e);
                        assert(paragraph.hidden).isFalse();
                    });
                });
            });
        });

        describe('given an event with no target', () => {
            it('should throw', () => {
                const button = document.createElement('button');

                onTargetElClick(button, (e) => {
                    assert(() => toggleVisibility(container, e))
                        .throws('Missing target for visibility toggle');
                });
            });
        });

        describe('given an event with an invalid target', () => {
            it('should throw', () => {
                const button = document.createElement('button');

                button.dataset.target = 'frodo';

                onTargetElClick(button, (e) => {
                    assert(() => toggleVisibility(container, e))
                        .throws('Invalid visibility toggle target `frodo`');
                });
            });
        });
    });
};
