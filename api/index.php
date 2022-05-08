<?php

define('DOC_ROOT', $_SERVER['DOCUMENT_ROOT']);
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

class API {

    private const ERROR_LOG_PATH = DOC_ROOT . '/tmp/error.log';
    private const METHODS        = [ 'GET', 'POST' ];

    // -- Constructor ----------------------------------------------------------

    public function __construct() {
        $method = $this->getMethod();

        if (!$method) {
            return $this->notAllowed();
        }

        $path = $this->getPath();

        switch ($path) {
            case '/api/log/error':
                if ($method !== 'POST') {
                    return $this->notAllowed();
                }

                $this->addErrorLog();
                return;
        }

        $this->notFound();
    }

    // -- Router ---------------------------------------------------------------

    /**
     * Returns the current API route.
     *
     * @return string
     */
    private function getPath() {
        return '/api/' . htmlspecialchars($_GET['path']);
    }

    /**
     * Returns the current HTTP method, if supported.
     *
     * @return string|void
     */
    private function getMethod() {
        $method = $_SERVER['REQUEST_METHOD'];

        if (in_array($method, self::METHODS)) {
            return $method;
        }
    }

    // -- HTTP Headers ---------------------------------------------------------

    /**
     * Sets a JSON response header
     */
    private function setJsonContent() {
        header('Content-type: application/json');
    }

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

    // -- Get Request Content --------------------------------------------------

    /**
     * Returns JSON content from a request
     */
    private function getRequestContent() {
        $json = file_get_contents('php://input');
        $data = json_decode($json);

        if (!$data) {
            $this->writeToErrorLog('Unable to decode JSON request');
            $this->outputJsonResponse([ 'status' => 'Unable to decode JSON request' ]);
            return;
        }

        return $data;
    }

    // -- Return JSON Response -------------------------------------------------

    /**
     *
     */
    private function outputJsonResponse($data) {
        $this->setJsonContent();
        echo json_encode($data);
    }

    // -- Logs -----------------------------------------------------------------

    /**
     * Adds an entry to the application log.
     */
    private function addErrorLog() {
        $data = $this->getRequestContent();

        if (!isset($data->error) || !is_string($data->error)) {
            $this->writeToErrorLog('Invalid request error log object');
            $this->outputJsonResponse([ 'status' => 'Invalid request error log object' ]);
            return;
        }

        $success = $this->writeToErrorLog($data->error);

        $this->outputJsonResponse([
            'status' => $success ? 'success' : 'fail',
        ]);
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

    /**
     * Outputs the application log as JSON.
     */
    private function outputLog() {

    }

}

new API();
