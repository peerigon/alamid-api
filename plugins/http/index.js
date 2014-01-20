"use strict";

function httpPlugin(alamidRequest, options) {
    options = options || {};

    options.server.on("request", alamidRequest.adapters.http);
}

module.exports = httpPlugin;