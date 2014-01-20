"use strict";

var router = require("./router.js");

exports.handleWs = require("./transport/ws/wsHandler.js");
exports.handleHttp = require("./transport/http/httpHandler.js");

exports.router = function() {
    return router;
};