"use strict";

var url = require('url'),
    router = require("../../router.js");

function httpAdapter(req, res, next) {
    var data;

    req.parsedUrl = url.parse(req.url, true);

    //unify req.body and req.query
    //we have only one single data attribute
    if (req.method === "GET" && req.parsedUrl && req.parsedUrl.query) {
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