
import { formatSummary } from '../tests.js';

/**
 * @type {import('../../unit/unit.js').Summary}
 */
const defaults = {
    assertions: 0,
    errors: [],
    failures: 0,
};

/**
 * @param {import('../../unit/unit.js').Utility}
 */
export default ({ assert, describe, it }) => {
    describe('formatSummary()', () => {
        it('should return a link to `./unit.html', () => {
            assert(formatSummary({ ...defaults }))
                .stringIncludes('<a href="./unit.html">')
                .stringIncludes('</a>');
        });

        describe('given no assertions', () => {
            it('should return a string containing `0 mischievous kobolds`', () => {
                assert(formatSummary({ ...defaults }))
                    .stringIncludes('0')
                    .stringIncludes('mischievous kobolds');
            });
        });

        describe('given a single assertion', () => {
            it('should return a string containing `1 mischievous kobold`', () => {
                assert(formatSummary({ ...defaults, assertions: 1 }))
                    .stringIncludes('1')
                    .stringIncludes('mischievous kobold')
                    .stringExcludes('kobolds');
            });
        });

        describe('given two assertions', () => {
            it('should return a string containing `2 mischievous kobolds`', () => {
                assert(formatSummary({ ...defaults, assertions: 2 }))
                    .stringIncludes('2')
                    .stringIncludes('mischievous kobolds');
            });
        });

        describe('given no failures', () => {
            it('should return a string that does not contain `Encountered`', () => {
                assert(formatSummary({ ...defaults })).stringExcludes('Encountered');
            });
        });

        describe('given failures', () => {
            let output = formatSummary({ ...defaults, failures: 10 });

            it('should return a link to `./unit.html` with a `data-error` attribute', () => {
                assert(output)
                    .stringIncludes('<a href="./unit.html" data-error="true">')
                    .stringIncludes('</a>');
            });

            it('should return a string containing `Encountered`', () => {
                assert(output).stringIncludes('Encountered');
            });
        });

        describe('given a single failure', () => {
            it('should return a string containing `1 ogre`', () => {
                assert(formatSummary({ ...defaults, failures: 1 }))
                    .stringIncludes('1 ogre')
                    .stringExcludes('ogres');
            });
        });

        describe('given two failures', () => {
            it('should return a string containing `2 ogres`', () => {
                assert(formatSummary({ ...defaults, failures: 2 })).stringIncludes('2 ogres');
            });
        });

        describe('given no errors', () => {
            it('should return a string that does not contain `Encountered`', () => {
                assert(formatSummary({ ...defaults })).stringExcludes('Encountered');
            });
        });

        describe('given errors', () => {
            let output = formatSummary({ ...defaults, errors: [ 'boots', 'towers', 'jalapeño' ] });

            it('should return a string containing `Encountered`', () => {
                assert(output).stringIncludes('Encountered');
            });

            it('should return a link to `./unit.html` with a `data-error` attribute', () => {
                assert(output)
                    .stringIncludes('<a href="./unit.html" data-error="true">')
                    .stringIncludes('</a>');
            });
        });

        describe('given a single error', () => {
            it('should return a string containing `1 dragon`', () => {
                assert(formatSummary({ ...defaults, errors: [ 'lobster' ] }))
                    .stringIncludes('1 dragon')
                    .stringExcludes('dragons');
            });
        });

        describe('given two errors', () => {
            it('should return a string containing `2 dragons`', () => {
                assert(formatSummary({ ...defaults, errors: [ 'broken', 'buggy' ] }))
                    .stringIncludes('2 dragons');
            });
        });

        describe('given two errors and two failures', () => {
            let output = formatSummary({ ...defaults, errors: [ 'broken', 'buggy' ], failures: 2 });

            it('should return a string containing `2 ogres`', () => {
                assert(output).stringIncludes('2 ogres');
            });

            it('should return a string containing `2 dragons`', () => {
                assert(output).stringIncludes('2 dragons');
            });
        });
    });
};
