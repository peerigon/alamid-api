"use strict";

var router = require("../../router.js");

function httpAdapter(req, res, next) {

    //TODO convert to alamid-request first
    router.handler(req, res, next);
}

module.exports = httpAdapter;