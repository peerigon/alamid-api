"use strict";

var http = require("http"),
    url = require("url"),
    prepareRequest = require("../prepareRequest.js"),
    router = require("../../router.js");

function wsAdapter(request, session, callback) {
    var req,
        res;

    //TODO pass handshake socket?
    req = new http.IncomingMessage({});
    req.transport = "ws";

    //strip the host to be consistent with http
    req.url = url.parse(request.url).path;

    req.method = request.method.toUpperCase();
    req.body = request.body || {};

    req.session = session;

    prepareRequest(req);

    res = new http.ServerResponse(req);
    res.end = function(response) {
        callback(response);
    };

    router.handler(req, res, function(err) {
        callback(err);
    });
}

module.exports = wsAdapter;