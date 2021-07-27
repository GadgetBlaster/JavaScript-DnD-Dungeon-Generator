// @ts-check

import { unitState } from '../state.js';

/**
 * @param {import('../state.js').Utility} utility
 */
export default ({ assert, describe, it }) => {
    describe('returns', () => {
        const unitObj = unitState();

        it('should return a object', () => {
            assert(unitObj).isObject();
        });

        describe('properties', () => {
            it('should return a object with a function property `runUnits`', () => {
                assert(unitObj.runUnits).isFunction();
            });

            it('should return a object with a function property `getSummary`', () => {
                assert(unitObj.getSummary).isFunction();
            });
        });
    });

    describe('runUnits()', () => {
        const { runUnits, getSummary } = unitState();

        let called = false;
        let assertFunc;
        let describeFunc;
        let itFunc;

        runUnits('/fake/suite', (utility) => {
            called = true;

            assertFunc   = utility.assert;
            describeFunc = utility.describe;
            itFunc       = utility.it;

            describeFunc('desc', () => {
                itFunc('it', () => {
                    assertFunc().equals();
                });
            });
        });

        it('should call the `tests` function param', () => {
            assert(called).isTrue();
        });

        it('should inject an `assert` function', () => {
            assert(assertFunc).isFunction();
        });

        it('should inject a `describe` function', () => {
            assert(describeFunc).isFunction();
        });

        it('should inject an `it` function', () => {
            assert(itFunc).isFunction();
        });

        it('should add the test key to the `msg` in `results`', () => {
            const { results } = getSummary();
            assert(results.pop().msg).stringIncludes('/fake/suite');
        });
    });

    describe('onError()', () => {
        const { onError, getSummary } = unitState();

        onError('Some unfortunate error');

        const { errors } = getSummary();

        const entry = errors.pop();

        it('should add a `Result` entry to `errors`', () => {
            assert(entry).isObject();
            assert(entry.isOk).isBoolean();
            assert(entry.msg).isString();
        });

        describe('the entry', () => {
            it('should have the error string as its `msg`', () => {
                assert(entry.msg).equals('Some unfortunate error');
            });

            it('should have a falsy `isOk`', () => {
                assert(entry.isOk).isFalse();
            });
        });
    });

    describe('nesting', () => {
        describe('when `it()` is called outside of a `describe()` callback', () => {
            it('should throw', () => {
                unitState().runUnits('/fake/scope', (utility) => {
                    assert(utility.it)
                        .throws('it() must be called inside of describe()');
                });
            });
        });

        describe('when `assert()` is called outside of an `it()` callback', () => {
            it('should throw', () => {
                unitState().runUnits('/fake/scope', (utility) => {
                    assert(utility.assert().equals)
                        .throws('assert() must be called inside of it()');
                });
            });
        });

        describe('when `describe()` is called inside of an `it()` callback', () => {
            it('should throw', () => {
                unitState().runUnits('/fake/scope', (utility) => {
                    utility.describe('desc', () => {
                        utility.it('it', () => {
                            assert(utility.describe)
                                .throws('describe() must be called inside of default() or describe()');
                        });
                    });
                });
            });
        });

        describe('when `it()` is called inside of an `it()` callback', () => {
            it('should throw', () => {
                unitState().runUnits('/fake/scope', (utility) => {
                    utility.describe('desc', () => {
                        utility.it('it', () => {
                            assert(utility.it)
                                .throws('it() must be called inside of describe()');
                        });
                    });
                });
            });
        });
    });

    describe('getSummary()', () => {
        describe('summary properties', () => {
            const { getSummary } = unitState();
            const summary = getSummary();

            it('should return a object', () => {
                assert(summary).isObject();
            });

            it('should return a object with a numeric `assertions` property', () => {
                assert(summary.assertions).isNumber();
            });

            it('should return a object with a numeric `failures` property', () => {
                assert(summary.failures).isNumber();
            });

            it('should return a object with a `results` array property', () => {
                assert(summary.results).isArray();
            });

            it('should return a object with a `errors` array property', () => {
                assert(summary.errors).isArray();
            });
        });

        describe('summary values', () => {
            describe('when two of three assertions pass', () => {
                const { runUnits, onError, getSummary } = unitState();

                runUnits('/fake/suite', (utility) => {
                    utility.describe('desc', () => {
                        utility.it('it', () => {
                            utility.assert().equals();
                            utility.assert().equals();
                            utility.assert(1).equals();
                        });
                    });
                });

                onError('Table flip');

                const summary = getSummary();

                it('summary `assertions` should be 3', () => {
                    assert(summary.assertions).equals(3);
                });

                it('summary `failures` should be 1', () => {
                    assert(summary.failures).equals(1);
                });

                it('summary `results` should contain 2 successes', () => {
                    assert(summary.results.filter(({ isOk }) => isOk).length).equals(2);
                });

                it('summary `results` should contain 2 failures', () => {
                    assert(summary.results.filter(({ isOk }) => !isOk).length).equals(2);
                });

                it('summary `errors` should contain 1 error', () => {
                    assert(summary.errors.length).equals(1);
                });
            });
        });

        describe('summary results', () => {
            describe('when each assertion is in its own `describe` and `it` callback', () => {
                const { runUnits, getSummary } = unitState();

                runUnits('/fake/suite', (utility) => {
                    utility.describe('description one', () => {
                        utility.it('it one', () => {
                            utility.assert().equals();
                        });
                    });

                    utility.describe('description two', () => {
                        utility.it('it two', () => {
                            utility.assert().equals();
                        });
                    });
                });

                const { results } = getSummary();

                describe('the first `msg` in the summary `results`', () => {
                    it('should contain the first description and assertion', () => {
                        assert(results[0].msg)
                            .stringIncludes('description one')
                            .stringIncludes('it one');
                    });
                });

                describe('the second `msg` in the summary `results`', () => {
                    it('should contain the first description and assertion', () => {
                        assert(results[1].msg)
                            .stringIncludes('description two')
                            .stringIncludes('it two');
                    });
                });
            });

            describe('when an assertion is inside two `describe` callbacks', () => {
                const { runUnits, getSummary } = unitState();

                runUnits('/fake/suite', (utility) => {
                    utility.describe('description one', () => {
                        utility.describe('description two', () => {
                            utility.it('it one', () => {
                                utility.assert().equals();
                            });
                        });
                    });
                });

                const { results } = getSummary();

                it('should add both descriptions to the summary `results`', () => {
                    assert(results.pop().msg)
                        .stringIncludes('description one')
                        .stringIncludes('description two');
                });
            });

            describe('when two assertions are made inside one `describe` callback and two `it` callbacks', () => {
                const { runUnits, getSummary } = unitState();

                runUnits('/fake/suite', (utility) => {
                    utility.describe('description one', () => {
                        utility.it('it one', () => { utility.assert().equals(); });
                        utility.it('it two', () => { utility.assert().equals(); });
                    });
                });

                const { results } = getSummary();

                describe('both summary `results`', () => {
                    it('should contain the description', () => {
                        results.forEach(({ msg }) => {
                            assert(msg).stringIncludes('description one');
                        });
                    });
                });

                describe('the first result `msg`', () => {
                    it('should contain the first assertion', () => {
                        assert(results[0].msg).stringIncludes('it one');
                    });
                });

                describe('the second result `msg`', () => {
                    it('should contain the second assertion', () => {
                        assert(results[1].msg).stringIncludes('it two');
                    });
                });
            });

            describe('when two assertions are made inside one `describe` and `it` callback', () => {
                const { runUnits, getSummary } = unitState();

                runUnits('/fake/suite', (utility) => {
                    utility.describe('description one', () => {
                        utility.it('it one', () => {
                            utility.assert().equals();
                            utility.assert().equals();
                        });
                    });
                });

                const { results } = getSummary();

                describe('both summary `results`', () => {
                    it('should contain the description and assertion', () => {
                        results.forEach(({ msg }) => {
                            assert(msg)
                                .stringIncludes('description one')
                                .stringIncludes('it one');
                        });
                    });
                });
            });

            describe('no assertions are made inside `describe` and `it` callbacks', () => {
                const { runUnits, getSummary } = unitState();

                runUnits('/fake/suite', (utility) => {
                    utility.describe('description one', () => {
                        utility.it('it one', () => {});
                    });

                    utility.describe('description two', () => {
                        utility.it('it two', () => {});
                    });
                });

                const { results } = getSummary();

                it('should not add anything to the summary `results`', () => {
                    assert(results.length).equals(0);
                });
            });
        });

        describe('summary errors', () => {
            describe('when two errors have added', () => {
                const { onError, getSummary } = unitState();

                onError('Bad goblin!');
                onError('Critical fail');

                const { errors } = getSummary();

                describe('summary `errors`', () => {
                    it('should contain 2 entries', () => {
                        assert(errors.length).equals(2);
                    });
                });

                describe('the first error in the summary', () => {
                    it('should have a falsy `isOk` property', () => {
                        assert(errors[0].isOk).isFalse();
                    });

                    it('should have the error string as its `msg` property', () => {
                        assert(errors[0].msg).equals('Bad goblin!');
                    });
                });

                describe('the second error in the summary', () => {
                    it('should have a falsy `isOk` property', () => {
                        assert(errors[1].isOk).isFalse();
                    });

                    it('should have the error string as its `msg` property', () => {
                        assert(errors[1].msg).equals('Critical fail');
                    });
                });
            });
        });
    });

    describe('assert()', () => {
        unitState().runUnits('/fake/suite', (utility) => {
            utility.describe('desc', () => {
                utility.it('it', () => {
                    const assertObj = utility.assert();

                    it('should return an object', () => {
                        assert(assertObj).isObject();
                    });

                    describe('object properties', () => {
                        const assertEntries = Object.entries(assertObj);

                        assertEntries.forEach(([ key, func ]) => {
                            describe(`#${key}`, () => {
                                it('should be a function', () => {
                                    assert(func).isFunction();
                                });

                                describe('when invoked', () => {
                                    const chainObj = func();

                                    it('should return an object', () => {
                                        assert(chainObj).isObject();
                                    });

                                    it('should return an object with the same keys & values as `assertEntries`', () => {
                                        const objectsDiffer = Object.entries(chainObj)
                                            .some(([ key1, value1 ], index) => {
                                                const [ key2, value2 ] = assertEntries[index];
                                                return key1 !== key2 || value1.name !== value2.name;
                                            });

                                        assert(objectsDiffer).isFalse();
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });

    describe('_runAssert()', () => {
        const { runUnits, getSummary } = unitState();

        describe('when an assertion is made', () => {
            const { assertions: startingAssertions } = getSummary();

            runUnits('/fake/suite', (utility) => {
                utility.describe('desc', () => {
                    utility.it('it', () => {
                        utility.assert().equals();
                    });
                });
            });

            const { assertions, results } = getSummary();

            it('should increment `assertions`', () => {
                assert(assertions).equals(startingAssertions + 1);
            });

            it('should add an entry to `results`', () => {
                assert(results.length).equals(assertions);
            });

            it('should add a `Result` entry to `results`', () => {
                let result = results.pop();

                assert(result).isObject();
                assert(result.isOk).isBoolean();
                assert(result.msg).isString();
            });
        });

        describe('when an assertion passes', () => {
            const { failures: startingFailures } = getSummary();

            runUnits('/fake/suite', (utility) => {
                utility.describe('desc', () => {
                    utility.it('it', () => {
                        utility.assert('some value').equals('some value');
                    });
                });
            });

            const { failures, results } = getSummary();

            it('should not increment `failures`', () => {
                assert(failures).equals(startingFailures);
            });

            it('the last item in `results` should include the string `Pass`', () => {
                assert(results.pop().msg).stringIncludes('Pass');
            });
        });

        describe('when an assertion fails', () => {
            const { failures: startingFailures } = getSummary();

            runUnits('/fake/suite', (utility) => {
                utility.describe('desc', () => {
                    utility.it('it', () => {
                        utility.assert('some value').equals('some other value');
                    });
                });
            });

            const { failures, results } = getSummary();

            it('should increment `failures`', () => {
                assert(failures).equals(startingFailures + 1);
            });

            it('the last item in `results` should include the string `Failure`', () => {
                assert(results.pop().msg).stringIncludes('Failure');
            });
        });
    });

    describe('describe()', () => {
        describe('when one `describe` function is called', () => {
            const { runUnits, getSummary } = unitState();

            runUnits('/fake/suite', (utility) => {
                utility.describe('what snow is like', () => {
                    utility.it('should be wet like', () => {
                        utility.assert().equals();
                    });
                });
            });

            const { results } = getSummary();

            it('should add the description to the `msg` in `results`', () => {
                assert(results.pop().msg).stringIncludes('what snow is like');
            });
        });

        describe('when two `describe` functions are called', () => {
            const { runUnits, getSummary } = unitState();

            runUnits('/fake/suite', (utility) => {
                utility.describe('what is the meaning of life', () => {
                    utility.it('is `42`', () => {
                        utility.assert(42).equals(42);
                    });
                });

                utility.describe('the universe and everything', () => {
                    utility.it('is also `42`', () => {
                        utility.assert('also 42').equals('also 42');
                    });
                });
            });

            const { results } = getSummary();

            describe('the first result `msg`', () => {
                it('should contain the first description', () => {
                    let hasFirstAssertion = results[0].msg.includes('what is the meaning of life');
                    assert(hasFirstAssertion).isTrue();
                });

                it('should not contain the second description', () => {
                    let hasFirstAssertion = results[0].msg.includes('the universe and everything');
                    assert(hasFirstAssertion).isFalse();
                });
            });
            describe('the second result `msg`', () => {
                it('should contain the second description', () => {
                    let hasFirstAssertion = results[1].msg.includes('the universe and everything');
                    assert(hasFirstAssertion).isTrue();
                });

                it('should not contain the first description', () => {
                    let hasFirstAssertion = results[1].msg.includes('what is the meaning of life');
                    assert(hasFirstAssertion).isFalse();
                });
            });
        });
    });

    describe('it()', () => {
        const { runUnits, getSummary } = unitState();

        runUnits('/fake/suite', (utility) => {
            utility.describe('what snow is like', () => {
                utility.it('should be wet like', () => {
                    utility.assert().equals();
                });
            });
        });

        const { results } = getSummary();

        it('should add the assertion to the `msg` in `results`', () => {
            assert(results.pop().msg).stringIncludes('should be wet like');
        });
    });
};
