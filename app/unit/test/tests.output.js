
import {
    dot,
    escapeHTML,
    fail,
    info,
    log,
    nav,
    render,
    resultMsg,
    scopeList,
    formatSummary,
} from '../output.js';

/**
 * @param {import('../unit.js').Utility}
 */
export default ({ assert, describe, it }) => {
    describe('dot()', () => {
        it('should return a `span` element', () => {
            let el = dot({});
            assert(el.tagName).equals('SPAN');
        });

        describe('given a falsy `isOk` property', () => {
            it('should return an element with the `dot` and `dot-fail` classes', () => {
                let el = dot({ isOk: false });
                assert(el.className).equals('dot dot-fail');
            });
        });

        describe('given a truthy `isOk` property', () => {
            it('should return an element with the `dot` and `dot-ok` class', () => {
                let el = dot({ isOk: true });
                assert(el.className).equals('dot dot-ok');
            });
        });
    });

    describe('escapeHTML()', () => {
        describe('given an HTML string', () => {
            it('should return a string with escaped HTML', () => {
                const html   = '<h1 class="logo">Sal\'s Soups &amp; Sandwiches</h1>';
                const expect = '&lt;h1 class=&quot;logo&quot;&gt;Sal&#x27;s Soups &amp;amp; Sandwiches&lt;&#x2F;h1&gt;';
                assert(escapeHTML(html)).equals(expect);
            });
        });
    });

    describe('fail()', () => {
        describe('given a string', () => {
            it('should return the string wrapped in an `<li>` with the fail CSS class', () => {
                assert(fail('failure')).equals('<li class="fail">failure</li>');
            });
        });
    });

    describe('info()', () => {
        describe('given a string', () => {
            it('should return the string wrapped in an `<li>`', () => {
                assert(info('info')).equals('<li>info</li>');
            });
        });
    });

    describe('log()', () => {
        describe('given no results', () => {
            it('should return an empty string', () => {
                assert(log([])).equals('');
            });
        });

        describe('given one success then one failure', () => {
            const results = [
                { isOk: true, msg: 'success' },
                { isOk: false, msg: 'failure' },
            ];

            it('should return only the failure', () => {
                assert(log(results)).equals(fail('failure'));
            });

            describe('given the verbose flag', () => {
                it('should return the success and the failure', () => {
                    const expect = info('success') + fail('failure');
                    assert(log(results, { verbose: true })).equals(expect);
                });
            });
        });

        describe('given two successes then two failures', () => {
            const results = [
                { isOk: true, msg: 'yep' },
                { isOk: true, msg: 'you bet' },
                { isOk: false, msg: 'nope' },
                { isOk: false, msg: 'no way' },
            ];

            it('should return only the two failures', () => {
                assert(log(results)).equals(fail('nope') + fail('no way'));
            });

            describe('given the verbose flag', () => {
                it('should return the two success then the two failures', () => {
                    const expect = info('yep') + info('you bet') + fail('nope') + fail('no way');
                    assert(log(results, { verbose: true })).equals(expect);
                });
            });
        });
    });

    describe('nav()', () => {
        describe('given no options', () => {
            const html = nav({});

            it('should contain the urls', () => {
                [
                    './unit.html',
                    './unit.html?scope=list',
                    './unit.html?verbose=true',
                ].forEach((url) => {
                    assert(html).stringIncludes(url);
                });
            });

            it('should mark the "All" link as active', () => {
                assert(html).stringIncludes('<a data-active="true" href="./unit.html">All</a>');
            });
        });

        describe('given a `scope` option', () => {
            const html = nav({ scope: 'fake' });

            it('should contain the urls', () => {
                [
                    './unit.html',
                    './unit.html?scope=list',
                    './unit.html?scope=fake&verbose=true',
                ].forEach((url) => {
                    assert(html).stringIncludes(url);
                });
            });

            it('should not mark the "All" link as active', () => {
                assert(html).stringIncludes('<a href="./unit.html">All</a>');
            });
        });

        describe('given a `scope` option of "list"', () => {
            it('should mark the "Tests" link as active', () => {
                assert(nav({ scope: 'list' }))
                    .stringIncludes('<a data-active="true" href="./unit.html?scope=list">Tests</a>');
            });
        });

        describe('given a truthy `verbose` option', () => {
            const html = nav({ verbose: true });

            it('should contain the urls', () => {
                [
                    './unit.html?verbose=true',
                    './unit.html?scope=list&verbose=true',
                    './unit.html',
                ].forEach((url) => {
                    assert(html).stringIncludes(url);
                });
            });

            it('should mark the "Verbose" link as active', () => {
                assert(nav({ verbose: true }))
                    .stringIncludes('<a data-active="true" href="./unit.html">Verbose</a>');
            });
        });

        describe('given a `scope` and truthy `verbose` options', () => {
            const html = nav({ scope: 'fake', verbose: true });

            it('should contain the urls', () => {
                [
                    './unit.html?verbose=true',
                    './unit.html?scope=list&verbose=true',
                    './unit.html?scope=fake',
                ].forEach((url) => {
                    assert(html).stringIncludes(url);
                });
            });
        });
    });

    describe('scopeList()', () => {
        describe('given an array of scopes', () => {
            const scopes = [ '/scope/one', '/scope/two' ];
            const html   = scopeList(scopes);

            it('should return an html list with an `<li>` and `</li>` for each scope', () => {
                assert((html.match(/<li>/g)).length).equals(scopes.length);
                assert((html.match(/<\/li>/g)).length).equals(scopes.length);
            });

            it('should return an html link with `?scope=scope` as the link\'s `href`', () => {
                scopes.forEach((scope) => {
                    assert(html).stringIncludes(`<a href="?scope=${scope}">`);
                });

                assert((html.match(/<\/a>/g)).length).equals(scopes.length);
            });
        });

        describe('given the `verbose` option', () => {
            const scopes = [ '/scope/one', '/scope/two' ];
            const html   = scopeList(scopes, { verbose: true });

            it('should return an html list with `&verbose=true` for each scope', () => {
                assert((html.match(/&verbose=true/g)).length).equals(scopes.length);
            });
        });
    });

    describe('render()', () => {
        describe('given an element and an html string', () => {
            it('should set the html string to the element', () => {
                const el = document.createElement('h1');
                render(el, '<strong>buff</strong>');
                assert(el.innerHTML).equals('<strong>buff</strong>');
            });
        });

        describe('called multiple times', () => {
            it('should replace the element\'s content with the last html string', () => {
                const el = document.createElement('section');
                render(el, '<p>first wizard</p>');
                render(el, '<p>second wizard</p>');
                assert(el.innerHTML).equals('<p>second wizard</p>');
            });
        });
    });

    describe('resultMsg()', () => {
        describe('given an empty array', () => {
            it('should return an empty string', () => {
                assert(resultMsg([])).equals('');
            });
        });

        describe('given a single entry', () => {
            it('should return the entry', () => {
                assert(resultMsg([ { msg: 'just us chickens' } ]))
                    .equals('just us chickens');
            });
        });

        describe('given three entries', () => {
            const entries = resultMsg([
                { msg: 'jimmy' }, { msg: 'joey' }, { msg: 'sarah' },
            ]);

            const lines = entries.split(`\n`);

            it('should return each entry on a new line', () => {
                assert(lines[0].trim()).equals('jimmy');
                assert(lines[1].trim()).equals('joey');
                assert(lines[2].trim()).equals('sarah');
            });

            it('should indent each line with two spaces', () => {
                assert(lines[0]).stringExcludes('  ');
                assert(lines[1]).stringIncludes('  ');
                assert(lines[2]).stringIncludes('    ');
            });
        });
    });

    describe('formatSummary()', () => {
        let summary = {
            assertions: 0,
            failures: 0,
            errors: [],
        };

        describe('errors', () => {
            describe('given `0` errors', () => {
                it('should return a string that does not contain `Errors`', () => {
                    assert(formatSummary({
                        ...summary,
                        assertions: 2,
                        failures: 1,
                    })).stringExcludes('Errors');
                });
            });

            describe('given `1` error', () => {
                it('should return a string containing `1 Error`', () => {
                    assert(formatSummary({
                        assertions: 1,
                        failures: 1,
                        errors: [ 'junk' ],
                    })).stringIncludes('1 Error');
                });
            });

            describe('given `10` errors', () => {
                it('should return a string containing `10 Errors`', () => {
                    assert(formatSummary({
                        assertions: 1,
                        failures: 1,
                        errors: [ 'sarah', 'fred', 'jain', 'bob', 'sally', 'joe', 'juniper', 'ted', 'snow', 'ralph' ],
                    })).stringIncludes('10 Errors');
                });
            });
        });

        describe('assertions', () => {
            describe('given `0` assertions', () => {
                it('should return a string containing `0 Assertions`', () => {
                    assert(formatSummary(summary)).stringIncludes('0 Assertions');
                });
            });

            describe('given `1` assertion', () => {
                it('should return a string containing `1 Assertion`', () => {
                    assert(formatSummary({ ...summary, assertions: 1 }))
                        .stringIncludes('1 Assertion');
                });
            });

            describe('given `2` assertions', () => {
                it('should return a string containing `2 Assertions`', () => {
                    assert(formatSummary({ ...summary, assertions: 2 }))
                        .stringIncludes('2 Assertion');
                });
            });
        });

        describe('failures', () => {
            describe('given no failures', () => {
                it('should return a string containing `0 Failures`', () => {
                    assert(formatSummary({ ...summary, assertions: 1 }))
                        .stringIncludes('0 Failures');
                });

                it('should return a `<span>` with the `ok` css class', () => {
                    assert(formatSummary({ ...summary, assertions: 1 }))
                        .stringIncludes('<span class="ok">')
                        .stringIncludes('</span>');
                });
            });

            describe('given failures', () => {
                it('should return a `<span>` with the `fail` css class', () => {
                    assert(formatSummary({ ...summary, assertions: 1, failures: 1 }))
                        .stringIncludes('<span class="fail">')
                        .stringIncludes('</span>');
                });

                describe('given `1` failure', () => {
                    it('should return a string containing `1 Failure`', () => {
                        assert(formatSummary({ ...summary, assertions: 1, failures: 1 }))
                            .stringIncludes('1 Failure');
                    });
                });

                describe('given `2` failures', () => {
                    it('should return a string containing `2 Failures`', () => {
                        assert(formatSummary({ ...summary, assertions: 1, failures: 2 }))
                            .stringIncludes('2 Failures');
                    });
                });
            });
        });
    });
};
