"use strict";

var url = require('url'),
    router = require("../../router.js");

function httpAdapter(req, res, next) {
    var data;

    //extract req.query
    req.parsedUrl = url.parse(req.url, true);
    req.query = req.parsedUrl.query || {};

    //unify req.query as body on GET requests
    if (req.method === "GET" && req.query) {
        data = req.parsedUrl.query;
        req.query = req.parsedUrl.query;
    }
    else {
        data = req.body;
    }

    //TODO should it be req.body or req.data?
    req.data = data;
    //TODO should we overwrite body? makes sense for compatibilty reasons
    req.body = data;

    //TODO convert to alamid-request first
    router.handler(req, res, next);
}

module.exports = httpAdapter;