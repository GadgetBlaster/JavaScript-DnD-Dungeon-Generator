 
/**
 * Run
 *
 * @param {Object} config
 *     @param {string[]} manifest
 *     @param {Function} onComplete
 *     @param {Function} onError
 *     @param {Function} runUnits
 */
export default ({
    manifest,
    onComplete,
    onError,
    runUnits,
}) => {
    return (async function run(index = 0) {
        if (!manifest.length) {
            onError('Empty test manifest');
            return;
        }

        /** @type {string} path */
        let path = manifest[index];

        if (!path) {
            onComplete();
            return;
        }

        try {
            /** @type {Function} units */
            let { default: units } = await import(path);
            await runUnits(path, units);
        } catch (error) {
            onError(error.stack.toString());
        }

        return run(index + 1);
    })();
};
