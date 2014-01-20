"use strict";

var http = require("http"),
    router = require("../../router.js");

function wsAdapter(request, session, callback) {
    var req,
        res;

    req = new http.IncomingMessage();
    req.url = request.path;
    req.method = request.method.toUpperCase();
    req.session = session;
    req.body = request.data;

    res = new http.OutgoingMessage();
    res.end = function(response) {
        callback(response);
    };

    //TODO proper implementation
    res.send = function(statusCode, response) {
        res.statusCode = statusCode;
        res.end(response);
    };

    router.handler(req, res, function(err) {
        console.log("nexted with err");
        callback(err);
    });
}

module.exports = wsAdapter;