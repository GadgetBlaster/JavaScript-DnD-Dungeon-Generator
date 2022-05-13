// @ts-check

import { isRequired } from './tools';

/**
 * @typedef {{
 *     data?: object;
 *     error?: string;
 *     status?: number;
 * }} Response
 */

/**
 * Sends an XHR request in JSON format.
 *
 * @param {string} url
 * @param {object} [options]
 *     @param {(Response) => void} [options.callback]
 *     @param {object} [options.data]
 *     @param {"GET" | "POST"} [options.method = "GET"]
 *     @param {XMLHttpRequest} [options.xhr = XMLHttpRequest]
 */
export function request(url, {
    callback,
    data,
    method = 'GET',
    xhr = new XMLHttpRequest(),
} = {}) {
    isRequired(url, 'url is required in request()');

    xhr.addEventListener('load', () => {
        let response = {};

        try {
            response = JSON.parse(xhr.response);
        } catch (error) {
            response.error = 'Unable to parse JSON response';
        }

        response.status = xhr.status;

        callback && callback(response);
    });

    xhr.open(method, url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.send(JSON.stringify(data));
}
