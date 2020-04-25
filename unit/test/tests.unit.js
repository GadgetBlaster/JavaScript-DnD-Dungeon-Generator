
import unit from '../unit.js';

export default ({ assert, describe, it }) => {
    describe('#unit', () => {
        const unitObj = unit();

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

    describe('#runUnits', () => {
        const { runUnits, getSummary } = unit();

        let called = false;
        let assertFunc;
        let describeFunc;
        let itFunc;

        runUnits('/fake/path', (utility) => {
            called = true;

            assertFunc   = utility.assert;
            describeFunc = utility.describe;
            itFunc       = utility.it;

            assertFunc().equals();
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

        it('should add the file path to the `msg` in `results`', () => {
            const { results } = getSummary();
            assert(results.pop().msg).stringContains('/fake/path');
        });
    });

    // TODO
    describe('nesting', () => {
        describe('when `it` is called outside of a `describe` callback', () => {
            it('should throw', () => {});
        });

        describe('when `assert` is called outside of an `it` callback', () => {
            it('should throw', () => {});
        });

        describe('when `describe` is called inside of an `it` callback', () => {
            it('should throw', () => {});
        });

        describe('when `it` is called inside of an `it` callback', () => {
            it('should throw', () => {});
        });
    });

    describe('#getSummary', () => {
        describe('summary properties', () => {
            const { getSummary } = unit();
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
        });

        describe('summary values', () => {
            describe('when two of three assertions pass', () => {
                const { runUnits, getSummary } = unit();

                runUnits('/fake/path', (utility) => {
                    utility.assert().equals();
                    utility.assert().equals();
                    utility.assert(1).equals();
                });

                const summary = getSummary();

                it('summary `assertions` should be 3', () => {
                    assert(summary.assertions).equals(3);
                });

                it('summary `failures` should be 1', () => {
                    assert(summary.failures).equals(1);
                });

                it('summary `results` should contain 3 entries', () => {
                    assert(summary.results.length).equals(3);
                });
            });
        });

        describe('summary `results`', () => {
            describe('when each assertion is in its own `describe` and `it` callback', () => {
                const { runUnits, getSummary } = unit();

                runUnits('/fake/path', (utility) => {
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
                    it('should contain the first description and expectation', () => {
                        assert(results[0].msg)
                            .stringContains('description one')
                            .stringContains('it one');
                    });
                });

                describe('the second `msg` in the summary `results`', () => {
                    it('should contain the first description and expectation', () => {
                        assert(results[1].msg)
                            .stringContains('description two')
                            .stringContains('it two');
                    });
                });
            });

            describe('when an assertion is inside two `describe` callbacks', () => {
                const { runUnits, getSummary } = unit();

                runUnits('/fake/path', (utility) => {
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
                        .stringContains('description one')
                        .stringContains('description two');
                });
            });

            describe('when two assertions are made inside one `describe` callback and two `it` callbacks', () => {
                const { runUnits, getSummary } = unit();

                runUnits('/fake/path', (utility) => {
                    utility.describe('description one', () => {
                        utility.it('it one', () => { utility.assert().equals(); });
                        utility.it('it two', () => { utility.assert().equals(); });
                    });
                });

                const { results } = getSummary();

                it('both summary `results` should contain the description', () => {
                    results.forEach(({ msg }) => {
                        assert(msg).stringContains('description one');
                    });
                });

                it('the first result `msg` should contain the first expectation', () => {
                    assert(results[0].msg).stringContains('it one');
                });

                it('the second result `msg` should contain the second expectation', () => {
                    assert(results[1].msg).stringContains('it two');
                });
            });

            describe('when two assertions are made inside one `describe` and `it` callback', () => {
                const { runUnits, getSummary } = unit();

                runUnits('/fake/path', (utility) => {
                    utility.describe('description one', () => {
                        utility.it('it one', () => {
                            utility.assert().equals();
                            utility.assert().equals();
                        });
                    });
                });

                const { results } = getSummary();

                it('both summary `results` should contain the description and expectation', () => {
                    results.forEach(({ msg }) => {
                        assert(msg)
                            .stringContains('description one')
                            .stringContains('it one');
                    });
                });
            });

            describe('no assertions are made inside `describe` and `it` callbacks', () => {
                const { runUnits, getSummary } = unit();

                runUnits('/fake/path', (utility) => {
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
    });

    describe('#assert', () => {
        const { runUnits } = unit();

        let assertFunc;

        runUnits('/fake/path', (utility) => {
            assertFunc = utility.assert;
        });

        const assertObj = assertFunc('some value');

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

                        it('should return an object with the same keys and values as `assertEntries`', () => {
                            const objectsDiffer = Object.entries(chainObj).some(([ key1, value1 ], index) => {
                                let [ key2, value2 ] = assertEntries[index];
                                return key1 !== key2 || value1.name !== value2.name;
                            });

                            assert(objectsDiffer).isFalse();
                        });
                    });
                });
            });
        });
    });

    describe('#_runAssert', () => {
        let lastResult;

        const { runUnits, getSummary } = unit({
            onAssert: (result) => {
                lastResult = result;
            },
        });

        let assertFunc;

        runUnits('/fake/path', (utility) => {
            assertFunc = utility.assert;
        });

        describe('when an assertion is made', () => {
            const { assertions: startingAssertions } = getSummary();

            assertFunc().equals();

            const { assertions, results } = getSummary();

            it('should increment `assertions`', () => {
                assert(assertions).equals(startingAssertions + 1);
            });

            it('should add an entry to `results`', () => {
                assert(results.length).equals(assertions);
            });

            it('should call `onAssert` and return a `Result` object', () => {
                assert(lastResult).isObject();
                assert(lastResult.isOk).isBoolean();
                assert(lastResult.msg).isString();
            });
        });

        describe('when an assertion passes', () => {
            const { failures: startingFailures } = getSummary();

            assertFunc('some value').equals('some value');

            const { failures, results } = getSummary();

            it('should not increment `failures`', () => {
                assert(failures).equals(startingFailures);
            });

            it('the last item in `results` should include the string `Pass`', () => {
                assert(results.pop().msg).stringContains('Pass');
            });
        });

        describe('when an assertion fails', () => {
            const { failures: startingFailures } = getSummary();

            assertFunc('some value').equals('some other value');

            const { failures, results } = getSummary();

            it('should increment `failures`', () => {
                assert(failures).equals(startingFailures + 1);
            });

            it('the last item in `results` should include the string `Failure`', () => {
                assert(results.pop().msg).stringContains('Failure');
            });
        });
    });

    describe('#describe', () => {
        describe('when one `describe` function is called', () => {
            const { runUnits, getSummary } = unit();

            runUnits('/fake/path', (utility) => {
                utility.describe('what snow is like', () => {
                    utility.assert().equals();
                });
            });

            const { results } = getSummary();

            it('should add the description to the `msg` in `results`', () => {
                assert(results.pop().msg).stringContains('what snow is like');
            });
        });

        describe('when two `describe` functions are called', () => {
            const { runUnits, getSummary } = unit();

            runUnits('/fake/path', (utility) => {
                utility.describe('what is the meaning of life', () => {
                    utility.assert(42).equals(42);
                });

                utility.describe('the universe and everything', () => {
                    utility.assert('also 42').equals('also 42');
                });
            });

            const { results } = getSummary();

            it('the first result `msg` should contain the first description', () => {
                let hasFirstExpectation = results[0].msg.includes('what is the meaning of life');
                assert(hasFirstExpectation).isTrue();
            });

            it('the first result `msg` should not contain the second description', () => {
                let hasFirstExpectation = results[0].msg.includes('the universe and everything');
                assert(hasFirstExpectation).isFalse();
            });

            it('the second result `msg` should contain the second description', () => {
                let hasFirstExpectation = results[1].msg.includes('the universe and everything');
                assert(hasFirstExpectation).isTrue();
            });

            it('the second result `msg` should not contain the first description', () => {
                let hasFirstExpectation = results[1].msg.includes('what is the meaning of life');
                assert(hasFirstExpectation).isFalse();
            });
        });
    });

    describe('#it', () => {
        const { runUnits, getSummary } = unit();

        runUnits('/fake/path', (utility) => {
            utility.describe('what snow is like', () => {
                utility.it('should be wet like', () => {
                    utility.assert().equals();
                });
            });
        });

        const { results } = getSummary();

        it('should add the expectation to the `msg` in `results`', () => {
            assert(results.pop().msg).stringContains('should be wet like');
        });
    });
};
