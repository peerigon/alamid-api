"use strict";

var http = require("http");

function enhancedResponsePlugin() {

    http.ServerResponse.prototype.success = function (data) {
        this.send(200, {
            status: "success",
            data: data
        });

        return this;
    };

    http.ServerResponse.prototype.fail = function (error, data) {
        this.send(400, {
            status: "fail",
            error: error,
            data: data
        });

        return this;
    };

    http.ServerResponse.prototype.error = function (error, data) {
        this.send(500, {
            status: "error",
            error: error,
            data: data
        });

        return this;
    };

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

    http.ServerResponse.prototype.status = function (code) {
        this.statusCode = code;
        return this;
    };
}

module.exports = enhancedResponsePlugin;