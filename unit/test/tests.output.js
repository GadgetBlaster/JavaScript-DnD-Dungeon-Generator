
import {
    dot,
    escapeHTML,
    fail,
    info,
    summary,
} from '../output.js';

export default ({ assert, describe, it }) => {
    describe('#dot', () => {
        describe('given a falsey `isOk` option', () => {
            it('should return a `<span>` with the `dot` and `dot-fail` class', () => {
                assert(dot({ isOk: false })).equals('<span class="dot dot-fail"></span>');
            });
        });

        describe('given a truthy `isOk` option', () => {
            it('should return a `<span>` with the `dot` and `dot-ok` class', () => {
                assert(dot({ isOk: true })).equals('<span class="dot dot-ok"></span>');
            });
        });
    });

    describe('#escapeHTML', () => {
        describe('given an HTML string', () => {
            it('should return a string with escaped HTML', () => {
                let html   = '<h1 class="logo">Sal\'s Soups &amp; Sandwiches</h1>';
                let expect = '&lt;h1 class=&quot;logo&quot;&gt;Sal&#x27;s Soups &amp;amp; Sandwiches&lt;&#x2F;h1&gt;';
                assert(escapeHTML(html)).equals(expect);
            });
        });
    });

    describe('#info', () => {
        describe('given a string', () => {
            it('should return the string wrapped in an `<li>`', () => {
                assert(info('info')).equals('<li>info</li>');
            });
        });
    });

    describe('#fail', () => {
        describe('given a string', () => {
            it('should return the string wrapped in an `<li>` with the fail CSS class', () => {
                assert(fail('failure')).equals('<li class="fail">failure</li>');
            });
        });
    });

    describe('#summary', () => {
        describe('given `0` assertions', () => {
            it('should return a string containing `0 Assertions`', () => {
                assert(summary(0, 0)).stringContains('0 Assertions');
            });
        });

        describe('given `1` assertion', () => {
            it('should return a string containing `1 Assertion`', () => {
                assert(summary(1, 0)).stringContains('1 Assertion');
            });
        });

        describe('given `2` assertions', () => {
            it('should return a string containing `2 Assertions`', () => {
                assert(summary(2, 0)).stringContains('2 Assertion');
            });
        });

        describe('given `0` failures', () => {
            it('should return a string containing `0 Failures`', () => {
                assert(summary(0, 0)).stringContains('0 Failures');
            });

            it('should return a `<span>` with the `ok` css class', () => {
                assert(summary(0, 0))
                    .stringContains('<span class="ok">')
                    .stringContains('</span>');
            });
        });

        describe('given `1` failure', () => {
            it('should return an HTML string containing `1 Failure`', () => {
                assert(summary(0, 1)).stringContains('1 Failure');
            });
        });

        describe('given `2` failure', () => {
            it('should return an HTML string containing `2 Failures`', () => {
                assert(summary(0, 2)).stringContains('2 Failures');
            });
        });
    });
};
