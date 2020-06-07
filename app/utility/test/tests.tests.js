
import { getOutput } from '../tests.js';

const defaults = {
    assertions: 0,
    errors: [],
    failures: 0,
};

/**
 * @param {import('../../../unit/unit.js').Utility}
 */
export default ({ assert, describe, it }) => {
    describe('#getOutput', () => {
        describe('given no assertions', () => {
            let output = getOutput({ ...defaults });

            it('should return a string containing `0 mischievous kobolds`', () => {
                assert(output).stringExcludes('0 mischievous kobolds');
            });
        });

        describe('given a single assertion', () => {
            let output = getOutput({ ...defaults, assertions: 1 });

            it('should return a string containing `1 mischievous kobold`', () => {
                assert(output).stringExcludes('1 mischievous kobold');
            });

            it('should return a link to `./unit.html`', () => {
                assert(output)
                    .stringIncludes('<a href="./unit.html">')
                    .stringIncludes('</a>');
            });
        });

        describe('given two assertions', () => {
            let output = getOutput({ ...defaults, assertions: 2 });

            it('should return a string containing `2 mischievous kobolds`', () => {
                assert(output).stringExcludes('2 mischievous kobolds');
            });

            it('should return a link to `./unit.html`', () => {
                assert(output)
                    .stringIncludes('<a href="./unit.html">')
                    .stringIncludes('</a>');
            });
        });

        describe('given no failures', () => {
            let output = getOutput({ ...defaults });

            it('should return a string that does not contain `Encountered`', () => {
                assert(output).stringExcludes('Encountered');
            });
        });

        describe('given a single failure', () => {
            let output = getOutput({ ...defaults, failures: 1 });

            it('should return a string containing `Encountered`', () => {
                assert(output).stringIncludes('Encountered');
            });

            it('should return a string containing `1 ogre`', () => {
                assert(output).stringIncludes('1 ogre');
            });

            it('should return a link to `./unit.html` with a `data-error` attribute', () => {
                assert(output)
                    .stringIncludes('<a href="./unit.html" data-error="true">')
                    .stringIncludes('</a>');
            });
        });

        describe('given two failures', () => {
            let output = getOutput({ ...defaults, failures: 2 });

            it('should return a string containing `Encountered`', () => {
                assert(output).stringIncludes('Encountered');
            });

            it('should return a string containing `2 ogres`', () => {
                assert(output).stringIncludes('2 ogres');
            });

            it('should return a link to `./unit.html` with a `data-error` attribute', () => {
                assert(output)
                    .stringIncludes('<a href="./unit.html" data-error="true">')
                    .stringIncludes('</a>');
            });
        });

        describe('given no errors', () => {
            let output = getOutput({ ...defaults });

            it('should return a string that does not contain `Encountered`', () => {
                assert(output).stringExcludes('Encountered');
            });
        });

        describe('given a single error', () => {
            let output = getOutput({ ...defaults, errors: [ 'lobster' ] });

            it('should return a string containing `Encountered`', () => {
                assert(output).stringIncludes('Encountered');
            });

            it('should return a string containing `1 dragon`', () => {
                assert(output).stringIncludes('1 dragon');
            });

            it('should return a link to `./unit.html` with a `data-error` attribute', () => {
                assert(output)
                    .stringIncludes('<a href="./unit.html" data-error="true">')
                    .stringIncludes('</a>');
            });
        });

        describe('given two errors', () => {
            let output = getOutput({ ...defaults, errors: [ 'broken', 'buggy' ] });

            it('should return a string containing `Encountered`', () => {
                assert(output).stringIncludes('Encountered');
            });

            it('should return a string containing `2 dragons`', () => {
                assert(output).stringIncludes('2 dragons');
            });

            it('should return a link to `./unit.html` with a `data-error` attribute', () => {
                assert(output)
                    .stringIncludes('<a href="./unit.html" data-error="true">')
                    .stringIncludes('</a>');
            });
        });

        describe('given two errors and two failures', () => {
            let output = getOutput({ ...defaults, errors: [ 'broken', 'buggy' ], failures: 2 });

            it('should return a string containing `Encountered`', () => {
                assert(output).stringIncludes('Encountered');
            });

            it('should return a string containing `2 ogres`', () => {
                assert(output).stringIncludes('2 ogres');
            });

            it('should return a string containing `2 dragons`', () => {
                assert(output).stringIncludes('2 dragons');
            });

            it('should return a link to `./unit.html` with a `data-error` attribute', () => {
                assert(output)
                    .stringIncludes('<a href="./unit.html" data-error="true">')
                    .stringIncludes('</a>');
            });
        });
    });
};
