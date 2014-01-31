"use strict";

var prepareRequest = require("../prepareRequest.js"),
    router = require("../../router.js");

function httpAdapter(req, res, next) {
    prepareRequest(req);
    router.handler(req, res, next);
}

module.exports = httpAdapter;