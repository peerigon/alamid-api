"use strict";

var http = require("http"),
    prepareRequest = require("../prepareRequest.js"),
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