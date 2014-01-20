"use strict";

function connectPlugin(alamidRequest, options) {
    options = options || {};
    options.app.use(alamidRequest.adapters.http);

}

module.exports = connectPlugin;