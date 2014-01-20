"use strict";

var httpAdapter = require("./httpAdapter.js");

function httpHandler(app) {
    app.use(httpAdapter);
}

module.exports = httpHandler;