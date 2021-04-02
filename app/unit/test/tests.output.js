
import {
    _escapeHTML,
    getLog,
    _getSuiteList,
    _getSummaryParts,
    fail,
    getSummary,
    getSummaryLink,
    info,
    getNav,
    resultMsg,
} from '../output.js';

/**
 * @param {import('../state.js').Utility}
 */
export default ({ assert, describe, it }) => {
    describe('_escapeHTML()', () => {
        describe('given an HTML string', () => {
            it('should return a string with escaped HTML', () => {
                const html   = '<h1 class="logo">Sal\'s Soups &amp; Sandwiches</h1>';
                const expect = '&lt;h1 class=&quot;logo&quot;&gt;Sal&#x27;s Soups &amp;amp; Sandwiches&lt;&#x2F;h1&gt;';
                assert(_escapeHTML(html)).equals(expect);
            });
        });
    });

    describe('getLog()', () => {
        describe('given no results', () => {
            it('should return an empty string', () => {
                assert(getLog([])).equals('');
            });
        });

        describe('given one success then one failure', () => {
            const results = [
                { isOk: true, msg: 'success' },
                { isOk: false, msg: 'failure' },
            ];

            it('should return only the failure', () => {
                assert(getLog(results))
                    .equals('<li class="fail">failure</li>');
            });

            describe('given the verbose flag', () => {
                it('should return the success and the failure', () => {
                    assert(getLog(results, { verbose: true }))
                        .equals([
                            '<li>success</li>',
                            '<li class="fail">failure</li>'
                        ].join('')
                    );
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
                assert(getLog(results))
                    .equals([
                        '<li class="fail">nope</li>',
                        '<li class="fail">no way</li>',
                    ].join('')
                );
            });

            describe('given the verbose flag', () => {
                it('should return the two success and the two failures', () => {
                    assert(getLog(results, { verbose: true }))
                        .equals([
                            '<li>yep</li>',
                            '<li>you bet</li>',
                            '<li class="fail">nope</li>',
                            '<li class="fail">no way</li>',
                        ].join('')
                    );
                });
            });
        });
    });

    describe('getNav()', () => {
        describe('given no options', () => {
            const html = getNav({});

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
            const html = getNav({ scope: 'fake' });

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
                assert(getNav({ scope: 'list' }))
                    .stringIncludes('<a data-active="true" href="./unit.html?scope=list">Tests</a>');
            });
        });

        describe('given a truthy `verbose` option', () => {
            const html = getNav({ verbose: true });

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
                assert(getNav({ verbose: true }))
                    .stringIncludes('<a data-active="true" href="./unit.html">Verbose</a>');
            });
        });

        describe('given a `scope` and truthy `verbose` options', () => {
            const html = getNav({ scope: 'fake', verbose: true });

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

    describe('_getSuiteList()', () => {
        describe('given an array of scopes', () => {
            const scopes = [ '/scope/one', '/scope/two' ];
            const html   = _getSuiteList(scopes);

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
            const html   = _getSuiteList(scopes, { verbose: true });

            it('should return an html list with `&verbose=true` for each scope', () => {
                assert((html.match(/&verbose=true/g)).length).equals(scopes.length);
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

    describe('_getSummaryParts()', () => {
        const defaultSummary = {
            assertions: 0,
            errors: [],
            failures: 0,
        };

        it('should return an object with `assertionsText` and `checkedForText` string properties', () => {
            let result = _getSummaryParts({ ...defaultSummary });
            assert(result).isObject();
            assert(result.assertionsText).isString();
            assert(result.checkedForText).isString();
        });

        describe('given no assertions', () => {
            let result = _getSummaryParts({ ...defaultSummary });

            describe('`assertionsText`', () => {
                it('should contain "0"', () => {
                    assert(result.checkedForText).stringIncludes('0');
                });
            });

            describe('`checkedForText`', () => {
                it('"kobolds" should be plural', () => {
                    assert(result.assertionsText).stringIncludes('kobolds');
                });
            });
        });

        describe('given a single assertion', () => {
            let result = _getSummaryParts({ ...defaultSummary, assertions: 1 });

            describe('`assertionsText`', () => {
                it('should contain "1"', () => {
                    assert(result.checkedForText).stringIncludes('1');
                });
            });

            describe('`checkedForText`', () => {
                it('"kobold" should be singular', () => {
                    assert(result.assertionsText)
                        .stringIncludes('kobold')
                        .stringExcludes('kobolds');
                });
            });
        });

        describe('given two assertions', () => {
            let result = _getSummaryParts({ ...defaultSummary, assertions: 2 });

            describe('`assertionsText`', () => {
                it('should contain "2"', () => {
                    assert(result.checkedForText).stringIncludes('2');
                });
            });

            describe('`checkedForText`', () => {
                it('"kobolds" should be plural', () => {
                    assert(result.assertionsText).stringIncludes('kobolds');
                });
            });
        });

        describe('given no errors or failures', () => {
            it('should not return a `issuesText` property', () => {
                assert(_getSummaryParts({ ...defaultSummary }).issuesText)
                    .isUndefined();
            });
        });

        describe('given failures', () => {
            it('should return an object with `issuesText` string property', () => {
                let result = _getSummaryParts({ ...defaultSummary, failures: 10 });
                assert(result.issuesText).isString();
            });

            describe('`issuesText`', () => {
                describe('given a single failure', () => {
                    it('should contain "1 ogre"', () => {
                        assert(_getSummaryParts({ ...defaultSummary, failures: 1 }).issuesText)
                            .stringIncludes('1 ogre')
                            .stringExcludes('ogres');
                    });
                });

                describe('given two failures', () => {
                    it('should contain "2 ogres"', () => {
                        assert(_getSummaryParts({ ...defaultSummary, failures: 2 }).issuesText)
                            .stringIncludes('2 ogres');
                    });
                });
            });
        });

        describe('given errors', () => {
            it('should return an object with `issuesText` string property', () => {
                let result = _getSummaryParts({ ...defaultSummary, errors: [ 'boots', 'towers', 'jalapeño' ] });
                assert(result.issuesText).isString();
            });

            describe('`issuesText`', () => {
                describe('given a single error', () => {
                    it('should contain "1 dragon"', () => {
                        assert(_getSummaryParts({ ...defaultSummary, errors: [ 'lobster' ] }).issuesText)
                            .stringIncludes('1 dragon')
                            .stringExcludes('dragons');
                    });
                });

                describe('given two errors', () => {
                    it('should contain "2 dragons"', () => {
                        assert(_getSummaryParts({ ...defaultSummary, errors: [ 'broken', 'buggy' ] }).issuesText)
                            .stringIncludes('2 dragons');
                    });
                });
            });
        });

        describe('given two errors and two failures', () => {
            let result = _getSummaryParts({
                ...defaultSummary,
                errors: [ 'broken', 'buggy' ],
                failures: 2,
            }).issuesText;

            describe('`issuesText`', () => {
                it('should contain "2 ogres"', () => {
                    assert(result).stringIncludes('2 ogres');
                });

                it('should return a string containing "2 dragons"', () => {
                    assert(result).stringIncludes('2 dragons');
                });
            });
        });
    });

    describe('getSummaryLink()', () => {
        const defaultSummary = {
            assertions: 0,
            errors: [],
            failures: 0,
        };

        it('should return a string', () => {
            assert(getSummaryLink({ ...defaultSummary })).isString();
        });

        it('should return a link to `./unit.html', () => {
            assert(getSummaryLink({ ...defaultSummary }))
                .stringIncludes('<a href="./unit.html">')
                .stringIncludes('</a>');
        });

        describe('given errors', () => {
            it('the link should include a `data-error` attribute', () => {
                assert(getSummaryLink({ ...defaultSummary, errors: [ 'Bad dates' ] }))
                    .stringIncludes('<a data-error="true" href="./unit.html">');
            });
        });

        describe('given failures', () => {
            it('the link should include a `data-error` attribute', () => {
                assert(getSummaryLink({ ...defaultSummary, failures: 1 }))
                    .stringIncludes('<a data-error="true" href="./unit.html">');
            });
        });
    });

    describe('getSummary()', () => {
        const defaultSummary = {
            assertions: 0,
            errors: [],
            failures: 0,
        };

        it('should return a string', () => {
            assert(getSummary({ ...defaultSummary })).isString();
        });

        it('should return a span with the "ok" class', () => {
            assert(getSummary({ ...defaultSummary }))
                .stringIncludes('<span class="ok">')
                .stringIncludes('</span>');
        });

        describe('given errors', () => {
            it('should return a span with the "fail" class', () => {
                assert(getSummary({ ...defaultSummary, errors: [ 'Bad dates' ] }))
                    .stringIncludes('<span class="fail">')
                    .stringIncludes('</span>');
            });
        });

        describe('given failures', () => {
            it('should return a span with the "fail" class', () => {
                assert(getSummary({ ...defaultSummary, failures: 1 }))
                    .stringIncludes('<span class="fail">')
                    .stringIncludes('</span>');
            });
        });
    });
};
