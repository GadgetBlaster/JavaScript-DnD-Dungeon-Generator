
import {
    escapeHTML,
    getLog,
    getNav,
    getOutput,
    getResultMessage,
    getResults,
    getSuiteList,
    getSummary,
    getSummaryLink,
    getSummaryParts,
    getTestList,
} from '../output.js';

const noop = () => {};

/**
 * @param {import('../state.js').Utility}
 */
export default ({ assert, describe, it }) => {
    describe('escapeHTML()', () => {
        describe('given an HTML string', () => {
            it('should return a string with escaped HTML', () => {
                const html   = '<h1 class="logo">Sal\'s Soups &amp; Sandwiches</h1>';
                const expect = '&lt;h1 class=&quot;logo&quot;&gt;Sal&#x27;s Soups &amp;amp; Sandwiches&lt;&#x2F;h1&gt;';
                assert(escapeHTML(html)).equals(expect);
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
            const nav = getNav({});

            it('should contain the urls', () => {
                [
                    './unit.html',
                    './unit.html?scope=list',
                    './unit.html?verbose=true',
                ].forEach((url) => {
                    assert(nav).stringIncludes(url);
                });
            });

            it('should mark the "All" link as active', () => {
                assert(nav).stringIncludes('<a data-active="true" href="./unit.html">All</a>');
            });
        });

        describe('given a `scope` option', () => {
            const nav = getNav({ scope: 'fake' });

            it('should contain the urls', () => {
                [
                    './unit.html',
                    './unit.html?scope=list',
                    './unit.html?scope=fake&verbose=true',
                ].forEach((url) => {
                    assert(nav).stringIncludes(url);
                });
            });

            it('should not mark the "All" link as active', () => {
                assert(nav).stringIncludes('<a href="./unit.html">All</a>');
            });
        });

        describe('given a `scope` option of "list"', () => {
            it('should mark the "Tests" link as active', () => {
                assert(getNav({ scope: 'list' }))
                    .stringIncludes('<a data-active="true" href="./unit.html?scope=list">Tests</a>');
            });
        });

        describe('given a truthy `verbose` option', () => {
            const nav = getNav({ verbose: true });

            it('should contain the urls', () => {
                [
                    './unit.html?verbose=true',
                    './unit.html?scope=list&verbose=true',
                    './unit.html',
                ].forEach((url) => {
                    assert(nav).stringIncludes(url);
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

    describe('getOutput()', () => {
        let suite = { '/test/tests.fake.js': noop };
        let state = {
            getSummary: () => ({
                assertions: 1,
                errors: [],
                failures: 0,
                results: [ { isOk: true, msg: 'fake test result' } ],
            }),
            runUnits: noop,
        };

        it('should return test results', () => {
            assert(getOutput(suite, state)).stringIncludes('Mumbling incantations');
        });

        describe('given a `scope` option of `list`', () => {
            it('should return a list of tests', () => {
                assert(getOutput(suite, state, { scope: 'list' }))
                    .stringIncludes('<ul><li><a href="?scope=/test/tests.fake.js">/test/tests.fake.js</a></li></ul>');
            });
        });

        describe('given a `scope` option for a specific test', () => {
            it('should only call `runUnits()` on the `scope` test path', () => {
                let scopesCalled = [];

                let scopedSuite = {
                    '/test/tests.fake.js': noop,
                    '/test/tests.fake2.js': noop,
                };

                let scopedState = {
                    ...state,
                    runUnits: (path) => {
                        scopesCalled.push(path);
                    },
                };

                getOutput(scopedSuite, scopedState, { scope: '/test/tests.fake.js' });

                assert(scopesCalled.length).equals(1);
                assert(scopesCalled[0]).equals('/test/tests.fake.js');
            });
        });
    });

    describe('getResultMessage()', () => {
        describe('given an empty array', () => {
            it('should return an empty string', () => {
                assert(getResultMessage([])).equals('');
            });
        });

        describe('given a single entry', () => {
            it('should return the entry', () => {
                assert(getResultMessage([ { msg: 'just us chickens' } ]))
                    .equals('just us chickens');
            });
        });

        describe('given three entries', () => {
            const entries = getResultMessage([
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

    describe('getResults()', () => {
        describe('given one passing result', () => {
            let summary = {
                assertions: 1,
                errors: [],
                failures: 0,
                results: [ { isOk: true, msg: 'fake success result' } ],
            };

            let result = getResults(summary);

            it('should render one passing dot', () => {
                assert(result)
                    .stringIncludes('<span data-animate="show" class="dot ok" style="animation-delay: 0ms"></span>');
            });

            it('should render a summary', () => {
                assert(result).stringIncludes('Checked for 1 mischievous kobold');
            });

            describe('given no options', () => {
                it('should output "All Tests"', () => {
                    assert(result).stringIncludes('All Tests');
                });

                it('should not output passing log entries', () => {
                    assert(result).stringExcludes('fake success result');
                });
            });

            describe('given the `verbose` option', () => {
                it('should output the log with successful entries', () => {
                    assert(getResults(summary, { verbose: true }))
                        .stringIncludes('fake success result');
                });
            });

            describe('given the `scope` option', () => {
                it('should output the scope', () => {
                    assert(getResults(summary, { scope: '/test/tests.fake.js' }))
                        .stringIncludes('/test/tests.fake.js');
                });

                it('should not output "All Tests"', () => {
                    assert(getResults(summary, { scope: '/test/tests.fake.js' }))
                        .stringExcludes('All Tests');
                });
            });

            describe('given an `onSuccess` option', () => {
                it('should call `onSuccess` and return the success message', () => {
                    let successLog;

                    getResults(summary, { onSuccess: (msg) => { successLog = msg; }});

                    assert(successLog).equals('Zero mischievous kobolds found 👏');
                });
            });
        });

        describe('given multiple results', () => {
            let summary = {
                assertions: 2,
                errors: [],
                failures: 0,
                results: [
                    { isOk: true, msg: 'fake success result' },
                    { isOk: true, msg: 'another success result' },
                ],
            };

            it('should render two passing dots', () => {
                assert(getResults(summary))
                    .stringIncludes('<span data-animate="show" class="dot ok" style="animation-delay: 0ms"></span>')
                    .stringIncludes('<span data-animate="show" class="dot ok" style="animation-delay: 2ms"></span>');
            });

            describe('given the `verbose` option', () => {
                it('should output the log with all entries', () => {
                    assert(getResults(summary, { verbose: true }))
                        .stringIncludes('fake success result')
                        .stringIncludes('another success result');
                });
            });
        });

        describe('given a failing results', () => {
            let summary = {
                assertions: 1,
                errors: [],
                failures: 1,
                results: [ { isOk: false, msg: 'fake failure' } ],
            };

            let result = getResults(summary);

            it('should render one failing dot', () => {
                assert(result)
                    .stringIncludes('<span data-animate="show" class="dot fail" style="animation-delay: 0ms"></span>');
            });

            it('should output the log with the failure entries', () => {
                assert(result).stringIncludes('fake failure');
            });

            describe('given an `onError` option', () => {
                it('should call `onError` and return the failure message', () => {
                    let errorLog;

                    getResults(summary, { onError: (msg) => { errorLog = msg; }});

                    assert(errorLog).equals('Encountered 1 ogre!');
                });
            });
        });

        describe('given a result containing an error', () => {
            let summary = {
                assertions: 1,
                errors: [ 'this is fine' ],
                failures: 0,
                results: [ { isOk: false, msg: 'fake error' } ],
            };

            let result = getResults(summary);

            it('should render one failing dot', () => {
                assert(result)
                    .stringIncludes('<span data-animate="show" class="dot fail" style="animation-delay: 0ms"></span>');
            });

            it('should output the log with the error entry', () => {
                assert(result).stringIncludes('fake error');
            });

            describe('given an `onError` option', () => {
                it('should call `onError` and return the error message', () => {
                    let errorLog;

                    getResults(summary, { onError: (msg) => { errorLog = msg; }});

                    assert(errorLog).equals('Encountered 1 dragon!');
                });
            });
        });
    });

    describe('getSuiteList()', () => {
        describe('given an array of scopes', () => {
            const scopes = [ '/scope/one', '/scope/two' ];
            const html   = getSuiteList(scopes);

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
            const html   = getSuiteList(scopes, { verbose: true });

            it('should return an html list with `&verbose=true` for each scope', () => {
                assert((html.match(/&verbose=true/g)).length).equals(scopes.length);
            });
        });
    });

    describe('getSummary()', () => {
        const defaultSummary = {
            assertions: 0,
            errors: [],
            failures: 0,
            results: [],
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

    describe('getSummaryLink()', () => {
        const defaultSummary = {
            assertions: 0,
            errors: [],
            failures: 0,
            results: [],
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

    describe('getSummaryParts()', () => {
        const defaultSummary = {
            assertions: 0,
            errors: [],
            failures: 0,
        };

        it('should return an object with `assertionsText` and `checkedForText` string properties', () => {
            let result = getSummaryParts({ ...defaultSummary });
            assert(result).isObject();
            assert(result.assertionsText).isString();
            assert(result.checkedForText).isString();
        });

        describe('given no assertions', () => {
            let result = getSummaryParts({ ...defaultSummary });

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
            let result = getSummaryParts({ ...defaultSummary, assertions: 1 });

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
            let result = getSummaryParts({ ...defaultSummary, assertions: 2 });

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
                assert(getSummaryParts({ ...defaultSummary }).issuesText)
                    .isUndefined();
            });
        });

        describe('given failures', () => {
            it('should return an object with `issuesText` string property', () => {
                let result = getSummaryParts({ ...defaultSummary, failures: 10 });
                assert(result.issuesText).isString();
            });

            describe('`issuesText`', () => {
                describe('given a single failure', () => {
                    it('should contain "1 ogre"', () => {
                        assert(getSummaryParts({ ...defaultSummary, failures: 1 }).issuesText)
                            .stringIncludes('1 ogre')
                            .stringExcludes('ogres');
                    });
                });

                describe('given two failures', () => {
                    it('should contain "2 ogres"', () => {
                        assert(getSummaryParts({ ...defaultSummary, failures: 2 }).issuesText)
                            .stringIncludes('2 ogres');
                    });
                });
            });
        });

        describe('given errors', () => {
            it('should return an object with `issuesText` string property', () => {
                let result = getSummaryParts({ ...defaultSummary, errors: [ 'boots', 'towers', 'jalapeño' ] });
                assert(result.issuesText).isString();
            });

            describe('`issuesText`', () => {
                describe('given a single error', () => {
                    it('should contain "1 dragon"', () => {
                        assert(getSummaryParts({ ...defaultSummary, errors: [ 'lobster' ] }).issuesText)
                            .stringIncludes('1 dragon')
                            .stringExcludes('dragons');
                    });
                });

                describe('given two errors', () => {
                    it('should contain "2 dragons"', () => {
                        assert(getSummaryParts({ ...defaultSummary, errors: [ 'broken', 'buggy' ] }).issuesText)
                            .stringIncludes('2 dragons');
                    });
                });
            });
        });

        describe('given two errors and two failures', () => {
            let result = getSummaryParts({
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

    describe('getTestList()', () => {
        it('should return an html list with an entry for each test in the suite', () => {
            assert(getTestList({
                '/test/tests.fake.js': noop,
                '/test/tests.fake2.js': noop,
            })).stringIncludes('<li><a href="?scope=/test/tests.fake.js">/test/tests.fake.js</a></li>')
                .stringIncludes('<li><a href="?scope=/test/tests.fake2.js">/test/tests.fake2.js</a></li>');
        });
    });
};
