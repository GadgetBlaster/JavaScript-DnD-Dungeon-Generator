// @ts-check

import run from '../run.js';

const noop = () => {};

const mockSummary = {
    assertions: 0,
    errors    : 0,
    failures  : 0,
    results   : [],
};

const mockUnit = {
    getSummary: () => mockSummary,
    onError   : noop,
    runUnits  : noop,
};

/**
 * @param {import('../state.js').Utility} utility
 */
export default ({ assert, describe, it }) => {

    // -- Public Functions -----------------------------------------------------

    describe('given a suite of test functions', () => {
        let names     = [];
        let functions = [];

        const suite = {
            '/test/tests.mock1.js': noop,
            '/test/tests.mock2.js': noop,
        };

        const runUnits = (name, tests) => {
            names.push(name);
            functions.push(tests);
            tests(); // Noop
        };

        const getSummary = () => mockSummary;

        const results = run({ ...mockUnit, runUnits, getSummary }, suite);

        it('calls runUnits() for each function in the suite', () => {
            const keys = Object.keys(suite);

            names.forEach((name, index) => {
                assert(name).equals(keys[index]);
            });
        });

        it('injects a tests function into runUnits() for each test file', () => {
            functions.forEach((func) => {
                assert(func).isFunction();
            });
        });

        it('calls getSummary() and returns the summary', () => {
            assert(results).equalsObject(mockSummary);
        });
    });

    describe('given an undefined test suite', () => {
        let onErrorResult;

        const onError = (error) => { onErrorResult = error; };

        // @ts-expect-error
        run({ ...mockUnit, onError });

        it('calls `onError()` and returns a string that includes "Invalid"', () => {
            assert(onErrorResult)
                .isString()
                .stringIncludes('Invalid');
        });
    });

    describe('given an invalid test suite', () => {
        let onErrorResult;

        const onError = (error) => { onErrorResult = error; };

        // @ts-expect-error
        run({ ...mockUnit, onError }, 'junk');

        it('calls `onError()` and returns a string that includes "Invalid"', () => {
            assert(onErrorResult)
                .isString()
                .stringIncludes('Invalid');
        });
    });

    describe('given an empty test suite', () => {
        let onErrorResult;

        const onError = (error) => { onErrorResult = error; };

        run({ ...mockUnit, onError }, {});

        it('calls onError() and returns a string that includes "Empty"', () => {
            assert(onErrorResult)
                .isString()
                .stringIncludes('Empty');
        });
    });

    describe('given a scope', () => {
        let unitsRun = [];

        const scope = '/some/scope';
        const suite = {
            [scope]: noop,
            '/some/other/scope': noop,
        };

        const runUnits = (name) => { unitsRun.push(name); };

        run({ ...mockUnit, runUnits }, suite, scope);

        it('calls runUnits() once for the scoped function', () => {
            assert(unitsRun.length).equals(1);
            assert(unitsRun[0]).equals(scope);
        });
    });

    describe('given an invalid scope', () => {
        let onErrorResult;

        const onError = (error) => { onErrorResult = error; };
        const suite   = { '/some/scope': noop };
        const scope   = '/invalid/scope';

        run({ ...mockUnit, onError }, suite, scope);

        it('calls onError() and returns a string that includes "Invalid" and the test scope', () => {
            assert(onErrorResult)
                .isString()
                .stringIncludes('Invalid')
                .stringIncludes('/invalid/scope');
        });
    });

    describe('given an invalid test function', () => {
        let onErrorResult;

        const onError = (error) => { onErrorResult = error; };
        const suite   = { '/some/scope': undefined };

        run({ ...mockUnit, onError }, suite);

        it('calls onError() and returns a string that includes "Invalid" and the test scope', () => {
            assert(onErrorResult)
                .isString()
                .stringIncludes('Invalid')
                .stringIncludes('/some/scope');
        });
    });

    describe('given a test function that throws an Error object', () => {
        let onErrorResult;

        const onError  = (error) => { onErrorResult = error; };
        const runUnits = (_, tests) => { tests(); };
        const suite    = { '/some/scope': () => { throw new TypeError('Whoops'); } };

        run({ ...mockUnit, onError, runUnits }, suite);

        it('calls onError() and returns a string that includes the error', () => {
            assert(onErrorResult)
                .isString()
                .stringIncludes('Error')
                .stringIncludes('Whoops');
        });
    });

    describe('given a test function that throws an error string', () => {
        let onErrorResult;

        const onError  = (error) => { onErrorResult = error; };
        const runUnits = (_, tests) => { tests(); };
        const suite    = { '/some/scope': () => { throw 'Something is wrong'; } };

        run({ ...mockUnit, onError, runUnits }, suite);

        it('calls onError() and returns the error string', () => {
            assert(onErrorResult)
                .isString()
                .equals('Something is wrong');
        });
    });
};
