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
     * @param error
     * @param data
     * @returns {http.ServerResponse}
     */
    http.ServerResponse.prototype.fail = function (error, data) {
        this.send(400, {
            status: "fail",
            error: error,
            data: data || {}
        });

        return this;
    };

    /**
     * ends the response with error object
     *
     * @param error
     * @param data
     * @returns {http.ServerResponse}
     */
    http.ServerResponse.prototype.error = function (error, data) {
        this.send(500, {
            status: "error",
            error: error,
            data: data || {}
        });

        return this;
    };

    /**
     * ends the response
     * can be called with strings or objects
     *
     * @param {Number=} statusCode
     * @param {String|Object} response
     * @returns {http.ServerResponse}
     */
    http.ServerResponse.prototype.send = function (statusCode, response) {
        if (arguments.length === 1) {
            statusCode = 200;
            response = arguments[0];
        }

        this.statusCode = statusCode;

        if (typeof response === "object") {
            response = JSON.stringify(response);
        }

        this.end(response);
        return this;
    };

    /**
     * sets the statusCode
     * @param {Number} code
     * @returns {http.ServerResponse}
     */
    http.ServerResponse.prototype.status = function (code) {
        this.statusCode = code;
        return this;
    };
}

module.exports = enhancedResponsePlugin;