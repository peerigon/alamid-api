"use strict";

var url = require("url");

function prepareRequest(req) {
    //extract req.query
    req.parsedUrl = url.parse(req.url, true);
    req.query = req.parsedUrl.query || {};

    //overwrite req.body with req.query on GET requests
    if (req.method === "GET" && req.query) {
        req.body = req.parsedUrl.query;
    }
}

module.exports = prepareRequest;