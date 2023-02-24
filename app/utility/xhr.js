// @ts-check

import { isRequired } from './tools.js';

/**
 * @typedef {{
 *     data?: object;
 *     error?: string;
 *     status?: number;
 * }} Response
 */

/**
 * @typedef {object} RequestOptions
 *
 * @prop {(Response) => void} [callback]
 * @prop {object} [data]
 * @prop {"GET" | "POST"} [options.method = "GET"]
 * @prop {XMLHttpRequest} [options.xhr = XMLHttpRequest]
 */

/**
 * @typedef {object} RequestParams
 *
 * @prop {string} url
 * @prop {RequestOptions} [options]
 */

/** @typedef {(url: string, options?: RequestOptions) => void} Request */

/**
 * Sends an XHR request in JSON format.
 *
 * @type {Request}
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
