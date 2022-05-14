// @ts-check

import {
    // Public Functions
    request,
} from '../xhr.js';

/**
 * Mocks an XHR object. I know, I don't want to talk about it.
 *
 * @param {object} [options]
 *     @param {object} [options.response]
 *     @param {number} [options.status = 200]
 *
 * @returns {{
 *     xhr: {
 *         addEventListener: (event: string, callback: (any) => void) => void;
 *         open: (method: string, url: string) => void;
 *         setRequestHeader: (name: string, value: string) => void;
 *         response: object;
 *         send: (data: object) => void;
 *         status: number;
 *     },
 *     simulate: (event: string) => void;
 *     getMockValues: () => {
 *          headerName: string;
 *          headerValue: string;
 *          requestData: object;
 *          requestMethod: "GET"|"POST";
 *          requestUrl: string;
 *     }
 * }}
 */
function getMockXhr({ response, status = 200 } = {}) {
    let loadListener;

    let headerName;
    let headerValue;
    let requestData;
    let requestMethod;
    let requestUrl;

    const xhr = {
        addEventListener: (event, callback) => {
            if (event === 'load') {
                loadListener = callback;
            }
        },
        open: (method, url) => {
            requestMethod = method;
            requestUrl    = url;
        },
        setRequestHeader: (name, value) => {
            headerName  = name;
            headerValue = value;
        },
        response,
        send: (data) => {
            requestData = data;
        },
        status,
    };

    return {
        xhr,
        simulate: (event) => {
            event === 'load' && loadListener();
        },
        getMockValues: () => ({
            headerName,
            headerValue,
            requestData,
            requestMethod,
            requestUrl,
        }),
    };
}

/**
 * @param {import('../../unit/state.js').Utility} utility
 */
export default ({ assert, describe, it }) => {

    // -- Public Functions -----------------------------------------------------

    describe('request()', () => {
        describe('request settings', () => {
            let { xhr, getMockValues } = getMockXhr();

            request('/api/fake/endpoint', {
                method: 'POST',
                // @ts-expect-error
                xhr,
            });

            const mockValues = getMockValues();

            it('sets the method and url', () => {
                assert(mockValues.requestMethod).equals('POST');
                assert(mockValues.requestUrl).equals('/api/fake/endpoint');
            });

            it('sets a JSON header', () => {
                assert(mockValues.headerName).equals('Content-Type');
                assert(mockValues.headerValue).equals('application/json');
            });
        });

        describe('a successful request', () => {
            let { xhr, simulate, getMockValues } = getMockXhr({
                response: JSON.stringify({ data: 'mock response' }),
            });

            let response;

            request('/api/fake/endpoint', {
                data: { fake: 'sent data' },
                callback: (data) => { response = data; },
                // @ts-expect-error
                xhr,
            });

            simulate('load');

            const { requestData } = getMockValues();

            it('makes an xhr request with the provided data and parses the response', () => {
                assert(requestData).equals('{"fake":"sent data"}');
                assert(response).equalsObject({
                    data: 'mock response',
                    status: 200,
                });
            });
        });

        describe('an invalid JSON response', () => {
            let { xhr, simulate } = getMockXhr({
                response: '{ mock: "junk ',
            });

            let response;

            request('/api/fake/endpoint', {
                callback: (data) => { response = data; },
                // @ts-expect-error
                xhr,
            });

            simulate('load');

            it('returns an error message', () => {
                assert(response).equalsObject({
                    error: 'Unable to parse JSON response',
                    status: 200,
                });
            });
        });

        describe('given no url', () => {
            it('throws', () => {
                // @ts-expect-error
                assert(() => request()).throws('url is required in request()');
            });
        });
    });


};
