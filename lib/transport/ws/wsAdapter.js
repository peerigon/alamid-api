"use strict";

var http = require("http"),
    router = require("../../router.js");

function wsAdapter(request, session, callback) {
    var req,
        res;

    //TODO pass handshake socket?
    req = new http.IncomingMessage({});
    req.url = request.url;
    req.method = request.method.toUpperCase();
    req.session = session;
    req.body = request.data;

    //TODO should we extract req.query here as well?
    //might make sense in a REST-based world

    res = new http.OutgoingMessage();
    res.end = function(response) {
        callback(response);
    };

    //TODO proper implementation
    res.send = function(statusCode, response) {

        var args = Array.prototype.slice.call(arguments);

        if(args.length === 2) {
            res.statusCode = args[0];
            res.end(args[1]);
            return;
        }

        res.end(args[0]);
    };

    router.handler(req, res, function(err) {
        callback(err);
    });
}

module.exports = wsAdapter;