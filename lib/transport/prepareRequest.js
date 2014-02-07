"use strict";

var url = require("url");

function prepareRequest(req) {
    //extract req.query
    req.parsedUrl = url.parse(req.url, true);
    req.query = req.parsedUrl.query || {};

    //overwrite req.body with req.query on GET requests
    //TODO really overwrite here?
    //it makes a difference between http/ws!
    if (req.method === "GET" && Object.keys(req.body).length === 0 && req.query !== {}) {
        req.body = req.query;
    }
}

module.exports = prepareRequest;