"use strict";

var http = require("http");

/**
 * enhance http.ServerResponse with useful methods
 */
function enhancedResponsePlugin() {

    /**
     * ends the response with success object
     *
     * @param {Object=} data
     * @returns {http.ServerResponse}
     */
    http.ServerResponse.prototype.success = function (data) {
        this.send(200, {
            status: "success",
            data: data || {}
        });

        return this;
    };

    /**
     * ends the response with fail object
     *
     * @param code
     * @param data
     * @returns {http.ServerResponse}
     */
    http.ServerResponse.prototype.fail = function (code, data) {
        this.send(400, {
            status: "fail",
            code: code,
            data: data || {}
        });

        return this;
    };

    /**
     * ends the response with error object
     *
     * @param code
     * @param data
     * @returns {http.ServerResponse}
     */
    http.ServerResponse.prototype.error = function (code, data) {
        this.send(500, {
            status: "error",
            code: code,
            data: data || {}
        });

        return this;
    };

    /**
     * ends the response
     * can be called with optional status code and response
     * uses res.status, res.data res.error if called without args
     *
     * @param {Number=} statusCode
     * @param {String|Object=} response
     * @returns {http.ServerResponse}
     */
    http.ServerResponse.prototype.send = function send(statusCode, response) {

        if (arguments.length === 2) {
            this.statusCode = statusCode;
        }

        if (arguments.length === 1) {
            response = arguments[0];
        }

        if (typeof this.status === "number") {
            this.statusCode = this.status;
            this.status = statusCodeToStatus(this.statusCode);
        }

        this.status = this.status || statusCodeToStatus(this.statusCode);

        if (arguments.length === 0) {

            response = {
                status: this.status,
                data: this.data || {}
            };

            if (this.code) {
                response.code = this.code;
            }

            if(this.message) {
                response.message = this.message;
            }
        }

        if (typeof response === "object") {
            response = JSON.stringify(response);
        }

        this.end(response);
    };
}

var statusMapping = {
    "success": 200,
    "fail": 400,
    "error": 500
};

function statusCodeToStatus(statusCode) {
    if (statusCode >= 200 && statusCode < 300) {
        return "success";
    }
    else if (statusCode >= 400 && statusCode < 500) {
        return "fail";
    }

    return "error";
}

function statusToStatusCode(status) {
    return statusMapping[status];
}

module.exports = enhancedResponsePlugin;