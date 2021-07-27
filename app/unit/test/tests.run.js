// @ts-check

import run from '../run.js';

const noop = () => {};

const mockSummary = {
    assertions: 0,
    failures  : 0,
    results   : [],
    errors    : [],
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
        };

        const getSummary = () => mockSummary;

        const results = run({ ...mockUnit, runUnits, getSummary }, suite);

        it('should call `runUnits` for each function in the suite', () => {
            const keys = Object.keys(suite);

            names.forEach((name, index) => {
                assert(name).equals(keys[index]);
            });
        });

        it('should inject a tests function into `runUnits` for each test file', () => {
            functions.forEach((func) => {
                assert(func).isFunction();
            });
        });

        it('should call `getSummary` returning the test summary', () => {
            assert(results).equalsObject(mockSummary);
        });
    });

    describe('given an undefined `suite`', () => {
        let onErrorResult;

        const onError = (error) => { onErrorResult = error; };

        // @ts-expect-error
        run({ ...mockUnit, onError });

        it('should call `onError` returning a string containing `Invalid`', () => {
            assert(onErrorResult)
                .isString()
                .stringIncludes('Invalid');
        });
    });

    describe('given an invalid suite', () => {
        let onErrorResult;

        const onError = (error) => { onErrorResult = error; };

        // @ts-expect-error
        run({ ...mockUnit, onError }, 'junk');

        it('should call `onError` returning a string containing `Invalid`', () => {
            assert(onErrorResult)
                .isString()
                .stringIncludes('Invalid');
        });
    });

    describe('given an empty suite', () => {
        let onErrorResult;

        const onError = (error) => { onErrorResult = error; };

        run({ ...mockUnit, onError }, {});

        it('should call `onError` and return a string containing `Empty`', () => {
            assert(onErrorResult)
                .isString()
                .stringIncludes('Empty');
        });
    });

    describe('given a `scope`', () => {
        let unitsRun = [];

        const scope = '/some/scope';
        const suite = {
            [scope]: noop,
            '/some/other/scope': noop,
        };

        const runUnits = (name) => { unitsRun.push(name); };

        run({ ...mockUnit, runUnits }, suite, scope);

        it('should call `runUnits` once for the scoped function', () => {
            assert(unitsRun.length).equals(1);
            assert(unitsRun[0]).equals(scope);
        });
    });

    describe('given an invalid `scope`', () => {
        let onErrorResult;

        const onError = (error) => { onErrorResult = error; };
        const suite   = { '/some/scope': noop };
        const scope   = '/invalid/scope';

        run({ ...mockUnit, onError }, suite, scope);

        it('should call `onError` returning a string containing `Invalid` and `scope`', () => {
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

        it('should call `onError` returning a string containing `Invalid` and `scope`', () => {
            assert(onErrorResult)
                .isString()
                .stringIncludes('Invalid')
                .stringIncludes('/some/scope');
        });
    });

    describe('given a test function that throws an `Error` object`', () => {
        let onErrorResult;

        const onError  = (error) => { onErrorResult = error; };
        const runUnits = (_, tests) => { tests(); };
        const suite    = { '/some/scope': () => { throw new TypeError('Whoops'); } };

        run({ ...mockUnit, onError, runUnits }, suite);

        it('should call `onError` returning a string containing an error', () => {
            assert(onErrorResult)
                .isString()
                .stringIncludes('Error')
                .stringIncludes('Whoops');
        });
    });

    describe('given a test function that throws an error string`', () => {
        let onErrorResult;

        const onError  = (error) => { onErrorResult = error; };
        const runUnits = (_, tests) => { tests(); };
        const suite    = { '/some/scope': () => { throw 'Something is wrong'; } };

        run({ ...mockUnit, onError, runUnits }, suite);

        it('should call `onError` returning the error string', () => {
            assert(onErrorResult)
                .isString()
                .equals('Something is wrong');
        });
    });
};
