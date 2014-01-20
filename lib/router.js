"use strict";

var middler = require("middler");

var router = middler();

exports.router = function() {
    return router;
};

exports.handleHttp = require("./transport/http/httpHandler.js");
exports.handleWs = require("./transport/ws/wsHandler.js");

