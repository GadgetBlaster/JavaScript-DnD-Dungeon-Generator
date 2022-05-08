// @ts-check

/** @typedef {{ status: number; data: object }} Response */

/**
 * Sends an XHR request in JSON format.
 *
 * TODO tests
 *
 * @param {object} args
 *     @param {"GET" | "POST"} args.method
 *     @param {string} args.url
 *     @param {object} args.data
 *
 * @param {object} [options]
 *     @param {(Response) => void} [options.callback]
 */
export function request({ method, url, data }, { callback } = {}) {
    let xhr = new XMLHttpRequest();

    xhr.open(method, url);

    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onload = () => {
        if (!callback) {
            return;
        }

        /** @type {Response} */
        let response = {
            data: {},
            status: xhr.status,
        };

        try {
            response.data = JSON.parse(xhr.response);
        } catch (error) {
            response.data = { error: 'Unable to parse JSON from the response' };
        }

        callback(response);
    };

    xhr.send(JSON.stringify(data));
}
