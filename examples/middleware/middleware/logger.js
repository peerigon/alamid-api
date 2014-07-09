"use strict";

var morgan = require("morgan"),
    clc = require("cli-color"),
    inspect = require("util").inspect,
    fs = require("fs");

//override to work with ws
morgan.token("response-time", function(req){
    if (!req._startAt) return "";
    var diff = process.hrtime(req._startAt);
    var ms = diff[0] * 1e3 + diff[1] * 1e-6;
    return ms.toFixed(3);
});

morgan.token("status", function(req, res) {
    var status = res.statusCode;

    if (status >= 500) {
        return clc.red(status);
    } // red
    else if (status >= 400) {
        return clc.yellow(status);
    } // yellow
    else if (status >= 300) {
        return clc.cyan(status);
    } // cyan

    return clc.green(status);
});

morgan.token("transport", function(req) { return req.transport; });
morgan.token("query", function(req) { return "\n query " + inspect(req.query, { colors: true, depth: null }); });
morgan.token("body", function(req) { return "\n body " + inspect(req.body, { colors: true, depth: null }); });
morgan.token("session", function(req) { return "\n session " + inspect(req.session, { colors: true, depth: null }); });

exports.debugSession = function() {
    return morgan(clc.cyan(":method :url") + " :status " + clc.cyan(":response-time ms [:transport]") + " :query :body :session");
};

exports.debug = function() {
    return morgan(clc.cyan(":method :url") + " :status " + clc.cyan(":response-time ms [:transport]") + " :query :body");
};