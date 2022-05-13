<?php

define('DOC_ROOT', $_SERVER['DOCUMENT_ROOT']);
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

class API {

    private const ERROR_LOG_PATH = DOC_ROOT . '/tmp/error.log';

    private const ROUTES = [
        '/api/log/error' => [ 'POST' ],
    ];

    // -- Constructor ----------------------------------------------------------

    public function __construct() {
        $method = $this->getMethod();
        $path = $this->getPath();

        if (!isset(self::ROUTES[$path])) {
            $this->notFound();
            $this->outputResponse('fail', '404: Not Found');
            return;
        }

        if (!in_array($method, self::ROUTES[$path])) {
            $this->notAllowed();
            $this->outputResponse('fail', '405: Method Not Allowed');
            return;
        }

        switch ($path) {
            case '/api/log/error':
                $this->addErrorLog();
                return;
        }
    }

    // -- Router ---------------------------------------------------------------

    /**
     * Returns the current API route.
     *
     * @return string
     */
    private function getPath() {
        $path = isset($_GET['path']) ? htmlspecialchars($_GET['path']) : '';
        return '/api/' . $path;
    }

    /**
     * Returns the current HTTP method, if supported.
     *
     * @return string|void
     */
    private function getMethod() {
        return $_SERVER['REQUEST_METHOD'];
    }

    // -- HTTP Headers ---------------------------------------------------------

    /**
     * Sets a 405 error header
     */
    private function notAllowed() {
        header("HTTP/1.0 405 Method Not Allowed");
    }

    /**
     * Sets a 404 error header
     */
    private function notFound() {
        header("HTTP/1.0 404 Not Found");
    }

    /**
     * Sets a JSON response header
     */
    private function setJsonContent() {
        header('Content-type: application/json');
    }

    /**
     * Sets an HTTP response code.
     *
     * @param "success"|"fail" $status
     */
    private function setResponseCode($status) {
        if ($status === 'success') {
            header("HTTP/1.0 200 OK");
            return;
        }

        header("HTTP/1.0 400 Bad Request");
    }

    // -- Get Request Content --------------------------------------------------

    /**
     * Returns JSON content from a request
     */
    private function getRequestContent() {
        $json = file_get_contents('php://input');
        $data = json_decode($json);

        if (!$data) {
            $this->writeToErrorLog('Unable to decode JSON request');
            $this->outputResponse('fail', 'Unable to decode JSON request');
            return;
        }

        return $data;
    }

    // -- Return JSON Response -------------------------------------------------

    /**
     * Outputs a JSON response.
     *
     * @param "success"|"fail" $status
     * @param string $error
     * @param array $data
     */
    private function outputResponse($status, $error = null, $data = null) {
        $this->setJsonContent();
        $this->setResponseCode($status);

        $response = [];

        if (isset($error)) {
            $response['error'] = $error;
        }

        if (isset($data)) {
            $response['data'] = $data;
        }

        echo json_encode($response);
    }

    // -- Logs -----------------------------------------------------------------

    /**
     * Adds an entry to the application log.
     */
    private function addErrorLog() {
        $data = $this->getRequestContent();

        if (!isset($data->error) || !is_string($data->error)) {
            $this->writeToErrorLog('Invalid error log object');
            $this->outputResponse('fail', 'Invalid error log object');
            return;
        }

        if ($this->writeToErrorLog($data->error)) {
            $this->outputResponse('success');
            return;
        }

        $this->outputResponse('fail', 'Unable to write to log');
    }

    /**
     * Writes to the error log file.
     *
     * @param string $filePath
     * @param string $entry
     *
     * @return number|false
     */
    private function writeToErrorLog($entry) {
        $date = date("Y-m-d H:i:s");
        return $this->writeToLog(self::ERROR_LOG_PATH, $date . ' '. $entry . "\n");
    }

    /**
     * Writes to a log file.
     *
     * @param string $filePath
     * @param string $entry
     *
     * @return number|false
     */
    private function writeToLog($filePath, $entry) {
        $handle = fopen($filePath, 'a');
        $bytes  = fwrite($handle, $entry);

        fclose($handle);

        return $bytes;
    }

}

new API();
